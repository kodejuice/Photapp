<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Events\PostAction;
use App\Events\CommentAction;
use App\Events\UserMentioned;

use App\Helper;

use App\User;
use App\Post;
use App\Like;
use App\Comment;
use App\Notification;



class CommentController extends Controller
{
    /**
     * comment on post
     */
    public function comment($id, Request $request) {
        $post = Post::firstWhere('post_id', $id);
        if (!$post) {
            return response(['errors' => ["Post doesn't exist"]], 404);
        }

        $validator = Validator::make($request->all(), [
            'message' => 'string|required',
        ]);

        if ($validator->fails()) {
            return response(['errors'=>$validator->errors()->all()], 422);
        }

        $user = $request->user();

        $comment = new Comment();
        $comment->user_id = $user->id;
        $comment->post_id = $post->post_id;
        $comment->message = $request->input('message');

        $comment->save();

        $post->comment_count += 1;
        $post->save();

        // update follow score
        Helper::updateFollowScore($user, $post->user_id, 'comment');

        // trigger event to notify post author of comment on thier post
        event(new PostAction($user, $post, 'comment', $comment->message));

        ////////////////////////////
        // notify mentioned users //
        ////////////////////////////
        $mentions = Helper::getMentions($comment->message);
        if (!empty($mentions)) {
            foreach ($mentions as $mentioned) {
                event(new UserMentioned($mentioned, $user, $post->post_id));
            }
        }

        return response(['message' => 'Comment added']);
    }


    /**
     * delete comment
     */
    public function deleteComment($id, Request $request) {
        $comment = Comment::firstWhere('comment_id', $id);
        if (!$comment) {
            return response(['errors' => ["Comment doesn't exist"]], 404);
        }

        $user = $request->user();
        if ($user->id != $comment->user_id) {
            return response(['errors' => ['Invalid action']], 422);
        }

        // delete all associated rows
        Like::where('comment_id', $id)->delete();
        Notification::where('post_id', $comment->post_id)
                    ->where('associated_user', $user->username)
                    ->where('message', $comment->message)
                    ->where('type', 'comment')
                    ->delete();
        Notification::where('comment_id', $comment->comment_id)
                    ->delete();

        $post = Post::firstWhere('post_id', $comment->post_id);
        $post->comment_count -= 1;
        $post->save();

        // update follow score
        Helper::updateFollowScore($user, $post->user_id, 'uncomment');

        // then delete comment
        $comment->delete();

        return response(['message' => "Comment deleted"], 200);
    }
    

    /**
     * like comment
     */
    public function likeComment($id, Request $request) {
        $comment = Comment::firstWhere('comment_id', $id);
        if (!$comment) {
            return response(['errors' => ["Comment doesn't exist"]], 404);
        }

        $user = $request->user();

        $L = Like::where('user_id', $user->id)
                 ->where('comment_id', $comment->comment_id)
                 ->first();
        if ($L) {
            return response(['message' => "You already liked this"]);
        }

        $new_like = new Like();
        $new_like->user_id = $user->id;
        $new_like->comment_id = $comment->comment_id;

        $comment->likes += 1;

        $comment->save();
        $new_like->save();

        // update follow score
        Helper::updateFollowScore($user, $comment->user_id, 'comment_like');

        // trigger event to notify the comment author of a new like
        event(new CommentAction($user, $comment, "like"));

        return response(['message' => 'Liked'], 200);
    }


    /**
     * dislike comment
     */
    public function dislikeComment($id, Request $request) {
        $comment = Comment::firstWhere('comment_id', $id);
        if (!$comment) {
            return response(['errors' => ["Comment doesn't exist"]], 404);
        }

        $user = $request->user();

        $L = Like::where('user_id', $user->id)->where('comment_id', $comment->comment_id);
        if (!$L->first()) {
            // user doesnt like this comment
            return response(['errors' => ["Invalid action"]], 200);
        }

        $L->delete();

        $comment->likes -= 1;
        $comment->save();

        // delete any notification
        Notification::where('type', 'like')
            ->where('comment_id', $comment->comment_id)
            ->where('associated_user', $user->username)
            ->delete();

        // update follow score
        Helper::updateFollowScore($user, $comment->user_id, 'comment_dislike');

        return response(['message' => "Disliked"], 200);

    }
}


