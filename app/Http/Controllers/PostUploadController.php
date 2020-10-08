<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use App\Events\FileUploaded;

use App\User;
use App\Post;

use App\Helper;

/**
 * Post upload controller
 */
class PostUploadController extends Controller
{
    private int $upload_limit = 15;
    private int $max_upload_size = 31457280; // 30MB (bytes)

    /**
     * Form upload controller
     */
    public function fileUpload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'files' => 'required',
            'files.*' => 'mimes:png,jpeg,jpg,bmp,svg,jfif,pjp,mp4,gif,webm,3gp|max:30720',
            'caption' => 'string|max:290',
        ]);

        if ($validator->fails()) {
            return response(['errors'=>$validator->errors()->all()], 422);
        }

        $uploaded_files = $request->file('files');
        if (count($uploaded_files) > $this->upload_limit) {
            return response(['errors' => ["Upload failed, maximum upload limit exceeded ($this->upload_limit)"]]);
        }

        $data = [];
        if ($request->hasfile('files')) {
            foreach ($uploaded_files as $file) {
                $file_type = Helper::getMediaType($file->getMimeType());
                if ($file_type != 'image' && $file_type != 'video')
                    continue;

                $file_name = time() . Str::random(20);
                $file_path = $file->path();

                // store file in local disk first
                $F = Helper::storeFile($file_name, $file_path, env("FILESYSTEM_PUBLIC_DISK")); // [file_name, file_path]

                $data[] = [
                    'name' => $F[0],
                    'type' => $file_type
                ];
            }
        }

        if (empty($data)) {
            return response(['errors' => ['Upload failed']], 422);
        }

        //////////////////////////////////////////
        // trigger event to move files to cloud //
        //////////////////////////////////////////

        $user = $request->user();
        $caption = $request->input('caption', '');

        event(new FileUploaded($user, json_encode($data), $caption));

        return response(['message' => 'Uploading']);
    }



    /**
     * API upload controller
     *  (via url)
     */
    public function UrlUpload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'url' => 'url',
            'urls' => 'array',
            'caption' => 'string|max:290',
        ]);

        if ($validator->fails()) {
            return response(['errors'=>$validator->errors()->all()], 422);
        }

        $URLS = [];
        if ($request->has('url')) {
            $URLS = [$request->input('url')];
        } elseif ($request->has('urls')) {
            $URLS = $request->input('urls');
        } else {
            return response(['errors' => ['URL required']], 422);
        }

        if (count($URLS) > $this->upload_limit) {
            return response(['errors' => ["Maximum upload limit exceeded ($this->upload_limit)"]], 422);
        }

        ///////////////////
        // download urls //
        ///////////////////

        $data = [];

        foreach ($URLS as $url) {
            $url = filter_var($url, FILTER_SANITIZE_URL);

            // invalid URL
            if (!filter_var($url, FILTER_VALIDATE_URL)) {
                continue;
            }

            $header = get_headers($url, 1);

            $file_size = Helper::getUrlContentLength($header);
            if ($file_size <= 0 || $file_size > $this->max_upload_size) {
                continue;
            }

            // ensure image / video
            $file_type = Helper::getUrlMediaType($header, $url);
            if ($file_type == 'video' || $file_type == 'image') {

                $file_name = time() . Str::random(20);
                $file_path = $url;

                // store file in local disk first
                $F = Helper::storeFile($file_name, $file_path, env("FILESYSTEM_PUBLIC_DISK")); // [file_name, file_path]

                $data[] = [
                    'name' => $F[0],
                    'type' => $file_type
                ];
            }
        }

        if (empty($data)) {
            return response(['errors' => ['Upload failed']], 422);
        }

        //////////////////////////////////////////
        // trigger event to move files to cloud //
        //////////////////////////////////////////

        $user = $request->user();
        $caption = $request->input('caption', '');

        event(new FileUploaded($user, json_encode($data), $caption));

        return response(['message' => 'Uploading']);
    }
}
