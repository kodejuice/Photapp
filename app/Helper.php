<?php

namespace App;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

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
        // TODO: research this!
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
    private static function isType(array $header, $t): bool
    {
        // TODO: research this!
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
     * @param  string  $url
     * @return bool
     */
    public static function validImage($url): bool
    {
        $data = @getimagesize($url);
        if (empty($data)) {
            return false;
        }
        return (strtolower(substr($data['mime'], 0, 5)) == 'image' ? true : false);
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
     * return media type
     * @param  array $headers  headers of a url
     * @param  string $url
     * @return string          'video' | 'image'
     */
    public static function getUrlMediaType($headers, $url='')
    {
        $image = 'image';

        if (self::validImage($url)) {
            return $image;
        } else {
            if (empty($headers)) {
                $headers = @get_headers($url, 1);
                if (!$headers) return null;
            }

            return self::validVideo($headers) ? 'video' : null;
        }
    }

    /**
     * Return media type from mime type
     * @param  string $mimeType
     */
    public static function mediaType(string $mimeType)
    {
        if (strstr($mimeType, 'video')) {
            return 'video';
        }
        else if (strstr($mimeType, 'image')) {
            return 'image';
        }
        else {
            return null;
        }
    }


    ///**
    // * get file extension based on media type
    // * @param  media-type $type  'video' | 'image'
    // * @return [type]            [description]
    // */
    // public static function getFileExtension($type): string
    // {
    //     // TODO: make this better ?
    //     //  maybe get the files original extension :/
    //     return $type == 'image' ? 'png' : 'mp4';
    // }


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
     * store file to disk/cloud
     * @param  string $file_name    name of file to save as
     * @param  string $file_path    file path | file url
     *
     * @param  string $drive        storage drive to save to
     * @see                         config/filesystems.php
     *
     * @return array                [file_name, absolute-path to file on disk/cloud]
     */
    public static function storeFile(string $file_name, string $file_path, string $drive): array
    {
        Storage::disk($drive)->put($file_name, fopen($file_path, 'r'));
        return [$file_name, Storage::disk($drive)->url($file_name)];
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
