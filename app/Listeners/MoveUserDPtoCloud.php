<?php

namespace App\Listeners;

use App\Events\UserDPChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use App\User;
use App\Helper;

class MoveUserDPtoCloud implements ShouldQueue
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
     * Handle the event.
     *
     * @param  UserDPChanged  $event
     * @return void
     */
    public function handle(UserDPChanged $event)
    {
        $user = $event->user;               // (User)
        $image = $event->image;             // (string)

        // user dp filesystem driver
        $disk = env('USER_DP_FS_DRIVER');

        $file = Helper::storeFile(
            $user->username,
            base64_decode($image),
            $disk
        ); // => [file_name, file_path]

        $user->profile_pic = $file[1];
        $user->save();
    }
}
