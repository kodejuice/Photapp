<?php

namespace App;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

use Spatie\Url\Url;

use App\User;
use App\Post;
use App\UserFollow;

/**
 * Utility functions
 */
class Helper
{
    public static function tags(string $string, string $delimeter): array
    {
        // assert(strlen($delimeter) == 1);
        preg_match_all("/".$delimeter."(\w+)/", $string, $matches);
        return $matches[1];
    }

    /**
     * get hash tags (#...) from string
     * @param  string $caption  [description]
     * @return [type]           [description]
     */
    public static function getHashTags(string $caption): array
    {
        return self::tags($caption, '#');
    }

    /**
     * get mentions (@...) from string
     * @param  string $caption  caption to get mentions from
     * @return array            array of all mentioned users
     */
    public static function getMentions(string $string): array
    {
        return self::tags($string, '@');
    }

    /**
     * get size of file url points to (via its header)
     * @param  array $headers  headers of a certain url
     * @return int             size of content
     */
    public static function getUrlContentLength($headers): int
    {
        $size = -1;

        if (!array_key_exists('Content-Length', $headers)) {
            return -1;
        } elseif (is_array($headers['Content-Length'])) {
            $len = count($headers['Content-Length']);
            $size = $headers['Content-Length'][$len-1];
        } else {
            $size = $headers['Content-Length'];
        }
        return (int) $size;
    }

    /**
     * check if content-type contains a certain needle (e.g 'video') ?
     * @param  array  $header  header of url
     * @param  string $t       needle to look for
     * @return bool
     */
    private static function isType(array $header, string $t): bool
    {
        if (!array_key_exists("Content-Type", $header)) {
            return false;
        }

        $type = '';
        if (is_array($header['Content-Type'])) {
            $len = count($header['Content-Type']);
            $type = $header['Content-Type'][$len-1];
        } else {
            $type = $header['Content-Type'];
        }
        return Str::contains($type, $t);
    }

    /**
     * Does the url point to a valid image
     * @param  array  $headers
     * @return bool
     */
    public static function validImage($headers): bool
    {
        return self::isType($headers, 'image');
    }

    /**
     * does the url headers contain a video/* content-type
     * @param  array $headers
     * @return bool
     */
    public static function validVideo($headers): bool
    {
        return self::isType($headers, 'video');
    }

    /**
     * return media type from (url | response headers)
     * @param  array $headers  headers of a url
     * @param  string $url
     * @return string          'video' | 'image'
     */
    public static function getUrlMediaType($headers)
    {
        if (self::validImage($headers)) {
            return 'image';
        }
        else if (self::validVideo($headers)) {
            return 'video';
        }
        return null;
    }

    /**
     * Return media type from mime type
     * @param  string $mimeType
     */
    public static function getMediaType(string $mimeType)
    {
        if (strstr($mimeType, 'video/')) {
            return 'video';
        }
        else if (strstr($mimeType, 'image/')) {
            return 'image';
        }
        return null;
    }

    /**
     * Store a newly uploaded file to the DB
     * @param  User   $user
     * @param  Post   $post
     * @param  string $caption      caption of the uploaded photo|video
     * @param  array  $paths        urls of posts
     * @param  array  $media_types  media types
     */
    public static function dbSave(User $user, Post $post, string $caption, array $paths, array $media_types): void
    {
        $post->user_id = $user->id;

        $post->caption = $caption;
        $post->post_url = json_encode($paths);
        $post->media_type = json_encode($media_types);
        $post->tags = json_encode(self::getHashTags($caption));
        $post->mentions = json_encode(self::getMentions($caption));

        $user->posts_count += 1;

        $user->save();
        $post->save();
    }


    /**
     * Store file to disk/cloud
     *
     * @param  string           $file_name  name of file to save as
     * @param  string|resource  $file       file path | file url | file stream
     *
     * @param  string $drive        storage drive to save to
     * @see                         config/filesystems.php
     *
     * @return array                [file_name, absolute-path to file on disk/cloud]
     */
    public static function storeFile(string $file_name, $file, string $drive): array
    {
        $disk = Storage::disk($drive);
        if (is_resource($file)) {
            $disk->put($file_name, $file);
        } else {
            $disk->put($file_name, fopen($file, 'r'));            
        }
        return [$file_name, $disk->url($file_name)];
    }

    /**
     * Stores a file in cloud (via stream).
     *
     * @param      string  $file_name    The file name
     * @param      string  $file_stream  The file stream
     *
     * @return     array   [file_name, absolute-path to file on disk/cloud]
     */
    public static function storeFileInCloud($file_name, $file_stream, string $drive): array
    {
        $disk = Storage::disk($drive);
        $disk->put($file_name, $file_stream);

        $url = $disk->url($file_name);

        if (strstr($url, 'drive.google.com')) {
            $file_name = self::getGDriveFileName($url);
        }

        return [$file_name, $url];
    }


    public static function getGDriveFileName(string $url)
    {
        // for some reason, gdrive doesnt respect the $filename we give,
        // it uses its own id, luckily that id is in the gdrive file url
        //  https://drive.google.com/uc?id=XXX
        //
        return Url::fromString($url)->getQueryParameter('id');
    }


    /**
     * increase the follow score of two people
     *
     * @param      \App\User  $user1  The user following
     * @param      int        $user2  The id of user beign followed
     */
    public static function updateFollowScore(User $user1, int $user2_id, string $action): void
    {
        $follow = UserFollow::where('user1_id', $user1->id)
            ->where('user2_id', $user2_id)
            ->first();
        if (!$follow) {
            // $user1 doesnt follow $user2
            // nothing to do
            return;
        }

        $map = [
            'post_like' => 0.01,
            'post_dislike' => -0.01,

            'comment' => 0.02,
            'uncomment' => -0.02,

            'comment_like' => 0.001,
            'comment_dislike' => -0.001,

            'save' => 0.002,

            'repost' => 0.009,
        ];

        // if (!array_key_exists($action, $map))
        //     return;

        $follow->follow_score += $map[$action];

        $follow->save();
    }
}
