<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
    /**
     * Form upload controller
     */
    public function fileUpload(Request $request)
    {
        // TODO: max photo size-> 30720 (30MB)
        // TODO: max video size-> 10240 (10MB)
        // TODO: resize photo to max width: 614px
        // TODO: clip video to max length: 60seconds

        $this->validate($request, [
          'files' => 'required|max:5120',
          'files.*' => 'mimes:png,jpeg,jpg,bmp,svg,jfif,pjp,mp4,webm,3gp',
          'caption' => 'string|max:290',
        ]);

        $uploaded_files = $request->file('files');
        if (count($uploaded_files) > 15) {
            return back()->with('error', "Upload failed, maximum upload limit exceeded (15)");
        }

        $data = [];
        if ($request->hasfile('files')) {
            foreach ($uploaded_files as $file) {
                $data[] = [
                    'data' => base64_encode($file->get()),
                    'ext' => $file->extension()
                ];
            }
        } else {
            return back()->with('error', 'Upload Failed');
        }


        //////////////////////////////////////////
        // trigger event to move files to cloud //
        //////////////////////////////////////////

        $user = $request->user();
        $caption = $request->input('caption', '');

        event(new FileUploaded($user, json_encode($data), $caption));

        return back()->with('message', 'Uploading');
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

        if (count($URLS) > 15) {
            return response(['errors' => ['Maximum upload limit exceeded (15)']], 422);
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

            // validate file size
            $file_size = Helper::getUrlContentLength($header);
            if ($file_size > 5242880 || $file_size <= 0) { // 5MB in bytes
                continue;
            }

            // ensure audio / video
            $file_type = Helper::getUrlMediaType($header, $url);
            if ($file_type == 'video' || $file_type == 'image') {
                // download file
                $data[] = [
                    'data' => base64_encode(file_get_contents($url)),
                    'ext' => Helper::getFileExtension($file_type)
                ];
            }
        }

        if (empty($data)) {
            if (count($URLS) > 1) {
                return response(['errors' => ['Invalid Files']], 422);
            }
            return response(['errors' => ['Invalid File']], 422);
        }


        //////////////////////////////////////////
        // trigger event to move files to cloud //
        //////////////////////////////////////////

        $user = $request->user();
        $caption = $request->input('caption', '');

        event(new FileUploaded($user, json_encode($data), $caption));

        return response(['message' => 'Uploading'], 200);
    }
}
