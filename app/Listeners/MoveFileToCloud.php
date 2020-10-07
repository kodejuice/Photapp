<?php

namespace App\Listeners;

use App\Events\FileUploaded;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use ImageResize;

use App\User;
use App\Post;
use App\Helper;

use App\Events\UserMentioned;
use App\Events\NewsFeedRequested;

class MoveFileToCloud implements ShouldQueue
{
    private string $cloud_drive;
    private string $public_disk_drive;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        $this->cloud_drive = env('FILESYSTEM_DRIVER');
        $this->public_disk_drive = env('FILESYSTEM_PUBLIC_DISK');
    }


    /**
     * resize uploaded image
     * 
     * if the width/height of image is above $max_size, resize it.
     *
     * @param      string  $file_name  The file name
     */
    private function processUploadedImage($file_name) {
        $max_size = 1000;
        $img = ImageResize::make(
            Storage::disk($this->public_disk_drive)->get($file_name)
        );

        $img_width = $img->getWidth();
        $img_height = $img->getHeight();

        $img->resize(
            min($img_width, $max_size),
            min($img_height, $max_size),
            function ($constraint) {
                // maintain aspect ratio
                $constraint->aspectRatio();
            }
        );

        // replace file $file_name
        Storage::disk(env('FILESYSTEM_PUBLIC_DISK'))
            ->put($file_name, $img->encode());
    }


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
