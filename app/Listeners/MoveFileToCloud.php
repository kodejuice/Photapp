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
    private string $local_disk_drive;
    private string $tmp_disk_drive; // where our uploaded files are stored temporarily

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        $this->cloud_drive = env('FILESYSTEM_DRIVER');
        $this->tmp_disk_drive = env('FILESYSTEM_TMP_DISK');
        $this->local_disk_drive = env('FILESYSTEM_LOCAL_DISK');
    }


    /**
     * resize uploaded image
     * 
     * if the width/height of image is above $max_size, resize it.
     *
     * @param      string  $file_name  The file name
     * @return     string  ( new file name )
     */
    private function processUploadedImage($file_name)
    {
        $tmp_disk = Storage::disk($this->tmp_disk_drive);

        $img = ImageResize::make(
            $tmp_disk->get($file_name)
        );
        $img->fit(800);

        // replace file $file_name
        $tmp_disk->delete($file_name);
        $tmp_disk->put($file_name, $img->encode());

        $url = $tmp_disk->url($file_name);
        if (strstr($url, 'drive.google.com')) {
            $file_name = Helper::getGDriveFileName($url);
        }

        return $file_name;
    }


    /**
     * reduce video length to 45seconds
     *
     * @param      string  $file_name  The file name
     * @return     string  new file name
     */
    private function processUploadedVideo($file_name)
    {
        $ffmpeg = FFMpeg\FFMpeg::create();

        // our video is here currently
        $tmp_disk = Storage::disk($this->tmp_disk_drive);

        // copy video from tmp_disk to local disk
        // so we can manipulate it
        Helper::storeFile($file_name, $tmp_disk->readStream($file_name), $this->local_disk_drive);
        $local_disk = Storage::disk($this->local_disk_drive);
        $file_path = $local_disk->path($file_name);

        $video = $ffmpeg->open($file_path);

        // create a new file to store changes
        $new_file_name = time() . Str::random(20);
        $local_disk->put($new_file_name, "");
        $new_file_path = $local_disk->path($new_file_name);

        // extract first 45 seconds
        $clip = $video->clip(FFMpeg\Coordinate\TimeCode::fromSeconds(0), FFMpeg\Coordinate\TimeCode::fromSeconds(45));
        $clip->save(new FFMpeg\Format\Video\WebM(), $new_file_path);

        // delete original video from tmp_disk
        $tmp_disk->delete($file_name);
        // and move modified video to tmp_disk
        Helper::storeFileInCloud($file_name, $local_disk->readStream($new_file_name), $this->tmp_disk_drive);

        // delete copied video + modified video from local disk
        $local_disk->delete($new_file_name);
        $local_disk->delete($file_name);

        $url = $tmp_disk->url($file_name);
        if (strstr($url, 'drive.google.com')) {
            $file_name = Helper::getGDriveFileName($url);
        }

        return $file_name;
    }


    /**
     * deletes the file from the tmp disk drive
     * @param  string $file_name
     */
    private function deleteFileFromTMPDisk($file_name) {
        Storage::disk($this->tmp_disk_drive)->delete($file_name);
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
                $file_name = $this->processUploadedImage($file_name);
            }
            else { // video
                $file_name = $this->processUploadedVideo($file_name);
            }

            $file_stream = Storage::disk($this->tmp_disk_drive)
                ->readStream($file_name);

            $L = Helper::storeFileInCloud(
                $file_name,
                $file_stream,
                $this->cloud_drive
            ); // => [file_name, file_path]

            // we've uploaded to the cloud, so we can delete this
            // file from the tmp disk
            $this->deleteFileFromTMPDisk($file_name);

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
        event(new NewsFeedRequested());

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

    public function failed(FileUploaded $event, $exception)
    {
        $data = json_decode($event->data);

        // delete all /tmp files
        foreach ($data as $F) {
            $file_name = $F->name;
            $this->deleteFileFromTMPDisk($file_name);
        }

        Log::error($exception, ['file upload (moving file to cloud failed)']);
    }

}
