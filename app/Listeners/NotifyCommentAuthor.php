<?php

namespace App\Listeners;

use App\Events\CommentAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use App\User;
use App\UserSetting;
use App\Notification;

class NotifyCommentAuthor
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
     * @param  \App\Events\CommentAction  $event
     * @return bool
     */
    public function shouldQueue(CommentAction $event)
    {
        $valid = $event->user->id != $event->comment->user_id;

        if (!$valid) {
            return false;
        }

        // check (if the user wants such notification)
        $user_setting = UserSetting::firstWhere('user_id', $event->comment->user_id);

        return $user_setting->notify_comments_likes==1 && $valid;
    }


    /**
     * Handle the event.
     *
     * @param  CommentAction  $event
     * @return void
     */
    public function handle(CommentAction $event)
    {
        $user = $event->user;       // User
        $comment = $event->comment; // Comment
        $action = $event->action;   // string

        $notif = new Notification();

        $notif->type = $event->action;
        $notif->user_id = $comment->user_id;
        $notif->comment_id = $comment->comment_id;
        $notif->associated_user = $user->username;

        if ($action == 'like') {
            $notif->message = "liked your comment: {$comment->message}";
        }

        $notif->save();
    }
}
