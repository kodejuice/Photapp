<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

use App\Events\PostAction;
use App\Events\NewsFeedRequested;

use App\User;
use App\Post;
use App\Like;
use App\Comment;
use App\Bookmark;
use App\NewsFeed;
use App\UserFollow;
use App\Notification;

use App\Helper;

class PostController extends Controller
{
    /**
     * update caption of a post
     */
    public function updatePost($id, Request $request)
    {
        $post = Post::firstWhere('post_id', $id);
        if (!$post) {
            return response(['errors' => ["Post doesn't exist"]], 404);
        }

        $user = $request->user();
        if ($user->id != $post->user_id) {
            return response(['errors' => ['Invalid action']], 422);
        }

        $validator = Validator::make($request->all(), [
            'caption' => 'string|required',
        ]);

        if ($validator->fails()) {
            return response(['errors'=>$validator->errors()->all()], 422);
        }

        $post->caption = $request->input('caption');
        $post->save();

        return response(['message' => 'Successfully updated caption']);
    }

    /**
     * save post
     */
    public function savePost($id, Request $request)
    {
        $post = Post::firstWhere('post_id', $id);
        if (!$post) {
            return response(['errors' => ["Post doesn't exist"]], 404);
        }

        $user = $request->user();

        if ($this->userSavedPost($user->id, $post->post_id)) {
            return response(['message' => ["Already saved"]]);
        }

        $bmark = new Bookmark();
        $bmark->user_id = $user->id;
        $bmark->post_id = $post->post_id;
        $bmark->save();

        // update follow score
        Helper::updateFollowScore($user, $post->user_id, 'save');

        return response(['message' => 'Done']);
    }

    /**
     * remove saved post
     */
    public function unsavePost($id, Request $request)
    {
        $post = Post::firstWhere('post_id', $id);
        if (!$post) {
            return response(['errors' => ["Post doesn't exist"]], 404);
        }

        $user = $request->user();

        if (!$this->userSavedPost($user->id, $post->post_id)) {
            return response(['message' => ["Invalid action"]]);
        }

        Bookmark::where('user_id', $user->id)
            ->where('post_id', $post->post_id)
            ->delete();

        // update follow score
        Helper::updateFollowScore($user, $post->user_id, 'unsave');

        return response(['message' => 'Done']);
    }


    /**
     * like post
     */
    public function likePost($id, Request $request)
    {
        $post = Post::firstWhere('post_id', $id);
        if (!$post) {
            return response(['errors' => ["Post doesn't exist"]], 404);
        }

        $user = $request->user();

        if ($this->userLikesPost($user->id, $post->post_id)) {
            return response(['message' => "You already liked this"]);
        }

        $new_like = new Like();
        $new_like->user_id = $user->id;
        $new_like->post_id = $post->post_id;

        $new_like->save();

        $post->like_count += 1;
        $post->save();

        // update follow score
        Helper::updateFollowScore($user, $post->user_id, 'post_like');

        // trigger event to notify the post author of a new like
        event(new PostAction($user, $post, "like"));

        return response(['message' => "Liked"], 200);
    }


    /**
     * unlike post
     */
    public function dislikePost($id, Request $request)
    {
        $post = Post::firstWhere('post_id', $id);
        if (!$post) {
            return response(['errors' => ["Post doesn't exist"]], 404);
        }

        $user = $request->user();

        if (!$this->userLikesPost($user->id, $post->post_id)) {
            return response(['errors' => ["Invalid action"]], 200);
        }

        Like::where('user_id', $user->id)
            ->where('post_id', $post->post_id)
            ->delete();

        $post->like_count -= 1;
        $post->save();

        // update follow score
        Helper::updateFollowScore($user, $post->user_id, 'post_dislike');

        // delete any notification
        Notification::where('type', 'like')
            ->where('post_id', $post->post_id)
            ->where('associated_user', $user->username)
            ->delete();

        return response(['message' => "Disliked"], 200);
    }


    /**
     * delete post
     */
    public function deletePost($id, Request $request)
    {
        $post = Post::firstWhere('post_id', $id);
        if (!$post) {
            return response(['errors' => ["Post doesn't exist"]], 404);
        }

        $user = $request->user();
        if ($user->id != $post->user_id) {
            return response(['errors' => ['Invalid action']], 422);
        }

        // delete all associated rows
        Like::where('post_id', $id)->delete();
        Comment::where('post_id', $id)->delete();
        Bookmark::where('post_id', $id)->delete();
        Notification::where('post_id', $id)->delete();

        // delete media in the cloud
        $paths = json_decode($post->post_url);

        foreach ($paths as $P) {
            // $P[0] -> file name
            // $P[1] -> full path (url)
            Storage::delete($P[0]);
        }

        // then delete post
        $post->delete();

        return response(['message' => 'Post deleted'], 200);
    }


    //////////
    // GETs //
    //////////

    /**
     * get post
     */
    public function getPost($id, Request $request)
    {
        $post = Post::firstWhere('post_id', $id);
        if (!$post) {
            return response(['errors' => ['Post not found']], 404);
        }

        $auth_user = $request->user();
        $this->getPostInfos(@$auth_user->id ?: null, [$post]);

        return response($post);
    }

    /**
     * get posts
     */
    public function getPosts(Request $request)
    {
        $auth_user = $request->user();

        $query = $request->input('q');
        $auth_feed = $request->input('my_feed');

        $limit = $request->input('limit', 50);
        $offset = $request->input('offset', 0);

        $posts = [];
        if (isset($query)) {
            if (strlen($query) > 2) {
                // post search
                $query = addslashes($query);
                $posts = Post::whereRaw("MATCH (caption, tags) AGAINST ('$query')")
                            ->limit($limit)
                            ->offset($offset)
                            ->get();
            }
        } elseif (isset($auth_feed)) {
            // posts tailored just for the authenticated user
            $posts = $this->getUserFeed($auth_user, $offset, $limit);
        } else {
            $posts = [];
            $update_feed = boolval($request->input('update_feed', 1));

            if ($update_feed) {
                // trigger event to update news feed in the background
                event(new NewsFeedRequested());

                $posts = NewsFeed::orderBy('id', 'asc')
                                ->offset($offset)
                                ->limit($limit)
                                ->get();
            }

            if (count($posts) == 0) {
                $posts = Post::orderByDesc('post_id')
                            ->offset($offset)
                            ->limit($limit)
                            ->get();
            }
        }

        $this->getPostInfos(@$auth_user->id ?: null, $posts);

        return response($posts);
    }


    /**
     * get post comments
     */
    public function getPostComments($id, Request $request)
    {
        $post = Post::firstWhere('post_id', $id);
        if (!$post) {
            return response(['errors' => ['Post not found']], 404);
        }

        $limit = $request->input('limit', 50);
        $offset = $request->input('offset', 0);

        $comments = DB::table('users')
                        ->join('comments', function ($join) use ($post) {
                            $join->on('users.id', '=', 'comments.user_id')
                                ->where('comments.post_id', '=', $post->post_id);
                        })
                        ->select('users.id', '.username', '.post_id', '.message', '.comment_id', '.likes', '.followers', 'comments.created_at')
                        ->orderByDesc('.likes')
                        ->limit($limit)
                        ->offset($offset)
                        ->get();

        $auth_user = $request->user();
        if ($auth_user) {
            foreach ($comments as $c) {
                $c->auth_user_likes = $this->userLikesComment($auth_user->id, $c->comment_id);
            }
        }

        return response($comments);
    }


    /////////////
    // Helpers //
    /////////////

    /**
     * get user feed
     */
    private function getUserFeed($user, $offset=0, $limit=50)
    {
        $key = $user->username . "-feed";

        $posts = Cache::get($key, []);
        if (count($posts) == 0) {
            $posts = DB::table('posts')
                        ->join('user_follows', function ($join) use ($user) {
                            $join->on('posts.user_id', '=', 'user_follows.user2_id')
                                ->where('user_follows.user1_id', $user->id);
                        })
                        ->orderByDesc('.follow_score')
                        ->select('posts.*')
                        ->get();

            Cache::put($key, $posts, now()->addMinutes(60));
        }

        $posts = array_slice($posts->toArray(), $offset, $limit);

        return $posts;
    }

    /**
     * get user infos
     */
    private function getPostInfos($user_id, $posts)
    {
        foreach ($posts as $p) {
            $p->username = User::firstWhere('id', $p->user_id)->username;      // username of post author (posts table only stores user id)
            if ($user_id) {
                $p->auth_user_likes = $this->userLikesPost($user_id, $p->post_id); // boolean (does logged-in user like this post)
                $p->auth_user_saved = $this->userSavedPost($user_id, $p->post_id); // boolean (has logged-in user saved this post)
                $p->auth_user_comment = $this->userComment($user_id, $p->post_id); // last comment of user on this post
                $p->auth_user_follows = $this->userFollows($user_id, $p->user_id); // boolean (does logged-in user follow post author)
            }
        }
    }

    /**
     * check if user1 follows user2
     */
    private function userFollows(int $user1_id, int $user2_id)
    {
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

    /**
     * get last user comment on a post
     */
    private function userComment($user_id, $post_id)
    {
        $comment = Comment::where('user_id', $user_id)
                        ->where('post_id', $post_id)
                        ->orderByDesc('comment_id')
                        ->first();
        return $comment ? $comment->message : "";
    }

    /**
     * does user like a post?
     */
    private function userLikesPost($user_id, $post_id)
    {
        $L = Like::where('user_id', $user_id)
                ->where('post_id', $post_id)
                ->first();
        return $L ? 1 : 0;
    }

    /**
     * does user like a comment?
     */
    private function userLikesComment($user_id, $comment_id)
    {
        $L = Like::where('user_id', $user_id)
                ->where('comment_id', $comment_id)
                ->first();
        return $L ? 1 : 0;
    }

    /**
     * has user saved a post?
     */
    private function userSavedPost($user_id, $post_id)
    {
        $L = Bookmark::where('user_id', $user_id)
                ->where('post_id', $post_id)
                ->first();
        return $L ? 1 : 0;
    }
}
