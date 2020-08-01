<?php

namespace App\Listeners;

use App\Events\FileUploaded;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use App\User;
use App\Post;
use App\Helper;

use App\Events\UserMentioned;
use App\Events\NewsFeedRequested;

class MoveFileToCloud implements ShouldQueue
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
     * @param  FileUploaded  $event
     * @return void
     */
    public function handle(FileUploaded $event)
    {
        $user = $event->user;               // (User)
        $caption = $event->caption;         // (string)
        $data = json_decode($event->data);  // (string)

        ///////////////////////////
        // upload files to cloud //
        ///////////////////////////
        $paths = [];
        foreach ($data as $F) {
            $file = $F->data;
            $extension = $F->ext;
            $file_name = time() . Str::random(20) . "." . $extension;
            $R[] = $file_name;

            $paths[] = Helper::storeFile(
                $file_name,
                base64_decode($file),
                env('FILESYSTEM_DRIVER')
            );
        }

        //////////////////////////
        // save file info to DB //
        //////////////////////////
        $post = new Post();
        Helper::dbSave($user, $post, $caption, $paths);

        //////////////////////
        // update news feed //
        //////////////////////
        event(new NewsFeedRequested());

        ////////////////////////////
        // notify mentioned users //
        ////////////////////////////
        $mentions = Helper::getMentions($caption);

        if (!empty($mentions)) {
            // bg task&
            foreach ($mentions as $mentioned) {
                event(new UserMentioned($mentioned, $user, $post->post_id));
            }
        }


        // Log::info("{$user->username} uploaded -> ".json_encode($paths));

        return true;
    }
}
