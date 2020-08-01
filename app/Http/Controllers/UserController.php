<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use ImageResize;

use App\User;
use App\Post;
use App\UserFollow;
use App\UserSetting;
use App\Notification;

use App\Events\UserFollowed;


class UserController extends Controller
{
    /**
     * update user
     */
    public function updateInfo(Request $request) {
        $validator = Validator::make($request->all(), [
            'full_name' => 'string|max:50',
            'bio' => 'string|max:150',
            'dob' => 'nullable|date',

            // settings
            'notify_post_likes' => 'boolean',
            'notify_comments_likes' => 'boolean',
            'notify_comments' => 'boolean',
            'notify_mentions' => 'boolean',
            'notify_follows' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response(['errors'=>$validator->errors()->all()], 422);
        }

        $user = $request->user();

        $name = $request->input('full_name', '');
        $bio = $request->input('bio', '');
        $dob = $request->input('dob', null);

        $user->full_name = $name ?: $user->full_name;
        $user->bio = $bio ?: $user->bio;
        $user->dob = $dob ?: $user->dob;

        $user->save();

        /*
         * save settings (if any)
         */
        $set = UserSetting::where('user_id', $user->id)->first();

        $set->notify_post_likes = $request->input('notify_post_likes', $set->notify_post_likes);
        $set->notify_comments_likes = $request->input('notify_comments_likes', $set->notify_comments_likes);
        $set->notify_comments = $request->input('notify_comments', $set->notify_comments);
        $set->notify_mentions = $request->input('notify_mentions', $set->notify_mentions);
        $set->notify_follows = $request->input('notify_follows', $set->notify_follows);
        $set->save();

        return response(['message' => 'Done']);
    }


    /**
     * update profile pic
     */
    public function updateDP(Request $request) {
        $this->validate($request, [
          'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
        ]);

        $user = $request->user();

        $uploaded_image = $request->file('image');
        $imagename = $user->username . '.' . $uploaded_image->extension();
        $destinationPath = public_path('/avatar');

        // resize image & store
        $img = ImageResize::make($uploaded_image->path());
        $img->resize(100, 100, function ($constraint) {
            $constraint->aspectRatio();
        })->save($destinationPath.'/'.$imagename);

        $user->profile_pic = $imagename;
        $user->save();

        return back()
          ->with('message', 'Success');
    }


    /**
     * follow user
     */
    public function followUser(int $id, Request $request) {
        $user = User::firstWhere('id', $id);
        if (!$user) {
            return response(['errors' => ['User not found']]);
        }

        $self = $request->user();

        $follows = UserFollow::where('user1_id', $self->id)->where('user2_id', $user->id);
        if ($follows->first() || $self->id == $user->id) {
            // user already followed
            return response(['errors' => ["Invalid action"]]);
        }

        $follow = new UserFollow();
        $follow->user1_id = $self->id;
        $follow->user2_id = $user->id;

        $self->follows += 1;
        $self->save();
        
        $user->followers += 1;
        $user->save();

        $follow->save();

        // create notification
        event(new UserFollowed($self, $user));

        return response(['message' => "User Followed"]);
    }


    /**
     * unfollow user
     */
    public function unfollowUser(int $id, Request $request) {
        $user = User::firstWhere('id', $id);
        if (!$user) {
            return response(['errors' => ['User not found']]);
        }

        $self = $request->user();

        $follows = UserFollow::where('user1_id', $self->id)->where('user2_id', $user->id);
        if (!$follows->first()) {
            return response(['errors' => ["Invalid action"]]);
        }

        $self->follows -= 1;
        $self->save();

        $user->followers -= 1;
        $user->save();

        $follows->delete();
        
        // delete notification
        Notification::where('type','follow')
        ->where('user_id', $user->id)
        ->where('associated_user', $self->username)
        ->delete();

        return response(['message' => "User Unfollowed"]);
    }

    /**
     * mark authenticated user notifications (as read)
     */
    public function markNotification($id, Request $request) {
        $notif = Notification::where('notification_id', $id)->first();
        if (!$notif) {
            return response(['errors' => ['Notification not found']], 404);
        }

        $notif->new = 0;
        $notif->save();

        return response(['message' => "Done"]);
    }

    /**
     * delete authenticated user notification 
     */
    public function deleteNotification($id, Request $request) {
        $notif = Notification::where('notification_id', $id);
        if (!$notif->first()) {
            return response(['errors' => ['Notification not found']], 404);
        }

        $notif->delete();

        return response(['message' => "Done"]);
    }


    //////////
    // GETs //
    //////////

    /**
     * get user
     */
    public function getUser(Request $request) {
        $usr = User::where('username', $request->input('username'))->first();
        if (!$usr) {
            return response(['errors' => ['Not found']], 404);
        }
        $usr->auth_user_follows = $this->userFollows($request->user()->id, $usr->id);
        return response($usr);
    }


    /**
     * get users
     */
    public function getUsers(Request $request) {
        $query = $request->input('q');

        if (isset($query) && $query!='*') {
            $query = addslashes($query);
            $matches = User::whereRaw("MATCH (username, full_name) AGAINST ('$query')")
                        ->get();

            return response($matches);
        }

        $offset = $request->input('offset', 0);
        $limit = $request->input('limit', 50);

        $users = User::offset($offset)->limit($limit)->get();

        $auth_user = $request->user();
        foreach ($users as $u) {
            $u->auth_user_follows = $this->userFollows($auth_user->id, $u->id);
        }

        return response($users);
    }


    /**
     * get user posts
     */
    public function getUserPosts($username, Request $request) {
        $usr = User::where('username', $username)->first();
        if (!$usr) {
            return response(['errors' => ['User not found']], 404);
        }

        $offset = $request->input('offset', 0);
        $limit = $request->input('limit', 50);

        $posts = Post::where('user_id', $usr->id)
            ->offset($offset)
            ->limit($limit)
            ->get();

        return response($posts);
    }

    /**
     * get user followers
     */
    public function getUserFollowers($username, Request $request) {
        $usr = User::where('username', $username)->first();
        if (!$usr) {
            return response(['errors' => ['User not found']], 404);
        }

        $followers = DB::table('users')
                        ->join('user_follows', function ($join) use($usr) {
                            $join->on('users.id', '=', 'user_follows.user1_id')
                                ->where('user_follows.user2_id', $usr->id);
                        })
                        ->select('users.id', 'users.full_name', 'users.username', 'users.profile_pic')
                        ->get();

        $auth_user = $request->user();
        foreach ($followers as $u) {
            $u->auth_user_follows = $this->userFollows($auth_user->id, $u->id);
        }

        return response($followers);
    }

    /**
     * get user following
     */
    public function getUserFollowing($username, Request $request) {
        $usr = User::where('username', $username)->first();
        if (!$usr) {
            return response(['errors' => ['User not found']], 404);
        }

        $following = DB::table('users')
                        ->join('user_follows', function ($join) use($usr) {
                            $join->on('users.id', '=', 'user_follows.user2_id')
                                ->where('user_follows.user1_id', $usr->id);
                        })
                        ->select('users.id', 'users.full_name', 'users.username', 'users.profile_pic')
                        ->get();

        $auth_user = $request->user();
        foreach ($following as $u) {
            $u->auth_user_follows = $this->userFollows($auth_user->id, $u->id);
        }

        return response($following);
    }

    /**
     * get user bookmarks
     */
    public function getUserBookmarks($username, Request $request) {
        $usr = User::where('username', $username)->first();
        if (!$usr) {
            return response(['errors' => ['User not found']], 404);
        }

        $saved = DB::table('posts')
                    ->join('bookmarks', function ($join) use($usr) {
                        $join->on('posts.post_id', '=', 'bookmarks.post_id')
                            ->where('bookmarks.user_id', $usr->id);
                    })
                    ->select('posts.*')
                    ->get();

        return response($saved);
    }

    /**
     * get user mentions
     */
    public function getUserMentions($username, Request $request) {
        $usr = User::where('username', $username)->first();
        if (!$usr) {
            return response(['errors' => ['User not found']], 404);
        }

        $matches = Post::whereRaw("MATCH(mentions) AGAINST('$username')")->get();

        return response($matches);
    }


    ////////////////////////
    // Authenticated user //
    ////////////////////////

    /**
     * get authenticated user profile
     */
    public function getAuthUserProfile(Request $request) {
        $user = $request->user();
        return response($user);
    }

    /**
     * get authenticated user posts
     */
    public function getAuthUserPosts(Request $request) {
        $user = $request->user();
        $posts = Post::where('user_id', $user->id)->get();
        return response($posts);
    }

    /**
     * get authenticated user settings
     */
    public function getAuthUserSettings(Request $request) {
        $user = $request->user();
        $settings = UserSetting::where('user_id', $user->id);
        return response($settings->first());
    }

    /**
     * get authenticated user notifications
     */
    public function getAuthUserNotifications(Request $request) {
        $user = $request->user();
        $notifs = Notification::where('user_id', $user->id)
            ->where('new', 1);

        return response($notifs->get());
    }

    /**
     * get authenticated user bookmarks
     */
    public function getAuthUserBookmarks(Request $request) {
        $user = $request->user();
        return $this->getUserBookmarks($user->username, $request);
    }

    /**
     * get authenticated user mentions
     */
    public function getAuthUserMentions(Request $request) {
        $user = $request->user();
        return $this->getUserMentions($user->username, $request);
    }

    /**
     * check if user1 follows user2
     */
    private function userFollows(int $user1_id, int $user2_id) {
        $user1 = User::where('id', $user1_id)->first();
        $user2 = User::where('id', $user2_id)->first();

        if (!$user2) {
            return response(['errors' => ['User not found']], 404);
        }

        $follows = UserFollow::where('user1_id', $user1_id)
                            ->where('user2_id', $user2_id)
                            ->first();

        return $follows ? 1 : 0;
    }
}
