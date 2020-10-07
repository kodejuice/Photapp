<?php

namespace App\Listeners;

use App\Events\UserDPChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Storage;

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

        $file_name = $user->username;

        // user display-picture filesystem driver
        $disk = env('USER_DP_FS_DRIVER');

        $drive = Storage::disk($disk);
        $drive->put($file_name, base64_decode($image));

        $user->profile_pic = $drive->url($file_name);
        $user->save();
    }
}
