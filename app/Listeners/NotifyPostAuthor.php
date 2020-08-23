<?php

namespace App\Listeners;

use App\Events\PostAction;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

use App\User;
use App\Post;
use App\UserSetting;
use App\Notification;

class NotifyPostAuthor implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine whether the listener should be queued.
     *
     * @param  \App\Events\PostLiked  $event
     * @return bool
     */
    public function shouldQueue(PostAction $event)
    {
        $not_same = $event->user->id != $event->post->user_id;

        if (!$not_same) {
            return false;
        }

        // chech (if the user wants such notification)
        $action = $event->action;
        $user_setting = UserSetting::firstWhere('user_id', $event->post->user_id);

        if ($action == 'like') {
            return $user_setting->notify_post_likes==1 && $not_same;
        } elseif ($action == 'comment') {
            return $user_setting->notify_comments==1 && $not_same;
        }

        return false;
    }

    /**
     * Handle the event.
     *
     * @param  PostLiked  $event
     * @return void
     */
    public function handle(PostAction $event)
    {
        $user = $event->user;       // User
        $post = $event->post;       // Post
        $action = $event->action;   // string
        $comment_message = $event->comment_message ?: "";

        $post_author = User::firstWhere('id', $post->user_id);

        $notif = new Notification();

        $notif->type = $event->action;
        $notif->post_id = $post->post_id;
        $notif->user_id = $post_author->id;
        $notif->associated_user = $user->username;

        if ($action == 'like') {
            $notif->message = "liked your post";
        } else {
            $notif->message = $comment_message;
        }

        $notif->save();

        //~ Log::info("{$notif->message}");

        return false;
    }
}
