<?php

namespace App\Listeners;

use App\Events\FileUploaded;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use FFMpeg;
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
    private function processUploadedImage($file_name)
    {
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


    /**
     * reduce video length to 45seconds
     *
     * @param      string  $file_name  The file name
     */
    private function processUploadedVideo($file_name)
    {
        $ffmpeg = FFMpeg\FFMpeg::create();

        $disk = Storage::disk(env("FILESYSTEM_PUBLIC_DISK"));
        $file_path = $disk->path($file_name);

        $video = $ffmpeg->open($file_path);

        // create a new file to store changes
        $new_file_name = time() . Str::random(20);
        $disk->put($new_file_name, "");
        $new_file_path = $disk->path($new_file_name);

        // extract first 45 seconds
        $clip = $video->clip(FFMpeg\Coordinate\TimeCode::fromSeconds(0), FFMpeg\Coordinate\TimeCode::fromSeconds(45));
        $clip->save(new FFMpeg\Format\Video\WebM(), $new_file_path);

        // delete original video
        Storage::disk($this->public_disk_drive)
            ->delete($file_name);

        // rename clipped video to $file_name
        Storage::disk($this->public_disk_drive)
            ->move($new_file_name, $file_name);
    }


    /**
     * deletes the file from the public disk drive
     * @param  string $file_name [description]
     */
    private function deleteFileFromDisk($file_name) {
        Storage::disk($this->public_disk_drive)->delete($file_name);
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
        $data = json_decode($event->data);

        ///////////////////////////
        // upload files to cloud //
        ///////////////////////////
        $paths = [];
        $media_types = [];

        foreach ($data as $F) {
            $file_name = $F->name;
            $file_type = $F->type;

            if ($file_type == 'image') {
                $this->processUploadedImage($file_name);
            }
            else { // video
                $this->processUploadedVideo($file_name);
            }

            $file_stream = Storage::disk($this->public_disk_drive)
                ->readStream($file_name);

            $L = Helper::storeFileInCloud(
                $file_name,
                $file_stream,
                $this->cloud_drive
            ); // => [file_name, file_path]

            // we've uploaded to the cloud, so we can delete this
            // file from the local disk
            $this->deleteFileFromDisk($file_name);

            $paths[] = $L;
            $media_types[] = $file_type;
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
