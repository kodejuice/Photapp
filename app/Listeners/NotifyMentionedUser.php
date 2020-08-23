<?php

namespace App\Listeners;

use App\Events\UserMentioned;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

use App\User;
use App\UserSetting;
use App\Notification;

class NotifyMentionedUser implements ShouldQueue
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
     * @param  \App\Events\UserMentioned  $event
     * @return bool
     */
    public function shouldQueue(UserMentioned $event)
    {
        $valid = boolval(User::firstWhere('username', $event->mentioned_user))
            && $event->mentioned_user != $event->who_mentioned->username;

        if (!$valid) {
            return false;
        }

        // chech (if the user wants such notification)
        $mentioned_user = User::firstWhere('username', $event->mentioned_user);
        $user_setting = UserSetting::firstWhere('user_id', $mentioned_user->id);

        return $user_setting->notify_mentions==1 && $valid;
    }


    /**
     * Handle the event.
     *
     * @param  UserMentioned  $event
     * @return void
     */
    public function handle(UserMentioned $event)
    {
        // User          $event->who_mentioned
        // string        $event->mentioned_user
        // int           $event->post_id

        $mentioned_user = User::firstWhere('username', $event->mentioned_user);

        $notif = new Notification();

        $notif->type = 'mention';
        $notif->post_id = $event->post_id;
        $notif->user_id = $mentioned_user->id;
        $notif->associated_user = $event->who_mentioned->username;
        $notif->message = "mentioned you in a post";

        $notif->save();

        // Log::info("{$event->mentioned_user} is mentioned by {$event->who_mentioned->username} on {$event->post_id} @ ". time());

        return false;
    }


    public function failed(UserMentioned $event, $exception)
    {
        // Log::info($exception);
    }
}
