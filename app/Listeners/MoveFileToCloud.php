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
        $media_types = [];
        foreach ($data as $F) {
            $file = $F->data;
            $extension = $F->ext;
            $file_name = time() . Str::random(20) . "." . $extension;
            $R[] = $file_name;

            $L = Helper::storeFile(
                $file_name,
                base64_decode($file),
                env('FILESYSTEM_DRIVER')
            ); // => [file_name, file_path]

            $paths[] = $L;
            $media_types[] = Helper::getUrlMediaType([], $L[1]); // 'image'|'video'
        }

        //////////////////////////
        // save file info to DB //
        //////////////////////////
        $post = new Post();
        Helper::dbSave($user, $post, $caption, $paths, $media_types);

        //////////////////////
        // update news feed //
        //////////////////////
        if (rand()%5 == 0) { // 1/5th of the time
            event(new NewsFeedRequested());
        }

        ////////////////////////////
        // notify mentioned users //
        ////////////////////////////
        $mentions = Helper::getMentions($caption);

        if (!empty($mentions)) {
            // bg task&
            foreach ($mentions as $mentioned) {
                event(new UserMentioned($mentioned, $user, $post->post_id, ""));
            }
        }

        // Log::info("{$user->username} uploaded -> ".json_encode($paths));

        return true;
    }
}
