<?php

namespace App\Listeners;

use App\Events\UserFollowed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use App\UserSetting;
use App\Notification;

class NotifyFollowedUser implements ShouldQueue
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

    public function shouldQueue(UserFollowed $ev)
    {
        // chech (if the user wants such notification)
        $user_setting = UserSetting::firstWhere('user_id', $ev->user2->id);
        return $user_setting->notify_follows==1;
    }

    /**
     * Handle the event.
     *
     * @param  UserFollowed  $event
     * @return void
     */
    public function handle(UserFollowed $event)
    {
        $user1 = $event->user1;
        $user2 = $event->user2;

        //
        $notif = new Notification();
        $notif->type = 'follow';
        $notif->user_id = $user2->id;
        $notif->associated_user = $user1->username;
        $notif->message = "started following you";

        $notif->save();

        return false;
    }
}
