<?php

namespace App;

use Illuminate\Support\Str;

use App\User;
use App\Post;
use App\UserFollow;


/**
 * Utility functions
 */
class Helper {
    static function tags(string $string, string $delimeter): array {
        // assert(strlen($delimeter) == 1);
        preg_match_all("/".$delimeter."(\w+)/", $string, $matches);
        return $matches[1];
    }

    /**
     * get hash tags (#...) from string
     * @param  string $caption  [description]
     * @return [type]           [description]
     */
    static function getHashTags(string $caption): array {
        return self::tags($caption, '#');
    }

    /**
     * get mentions (@...) from string
     * @param  string $caption  caption to get mentions from 
     * @return array            array of all mentioned users
     */
    static function getMentions(string $string): array {
        return self::tags($string, '@');
    }

    /**
     * get size of file url points to (via its header)
     * @param  array $headers  headers of a certain url
     * @return int             size of content
     */
    static function getUrlContentLength($headers): int {
        $size = -1;

        if (!array_key_exists('Content-Length', $headers)) {
            return -1;
        } else if (is_array($headers['Content-Length'])) {
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
    static private function isType($header, $t): bool {
        if (!array_key_exists("Content-Type", $header))
            return false;

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
    static public function validImage($url): bool {
        $data = @getimagesize($url);
        if (empty($data)) return false;
        return (strtolower(substr($data['mime'], 0, 5)) == 'image' ? true : false);  
    }

    /**
     * does the url headers contain a video/* content-type
     * @param  array $headers
     * @return bool
     */
    static public function validVideo($headers): bool {
        return self::isType($headers, 'video');
    }

    /**
     * return media type
     * @param  array $headers  headers of a url
     * @param  string $url
     * @return string          'video' | 'image'
     */
    static public function getUrlMediaType($headers,$url='') {
        if (self::validImage($url)) return 'image';
        elseif (self::validVideo($headers)) return 'video';
        else return null;
    }

    /**
     * get file extension based on media type
     * @param  media-type $type  'video' | 'image'
     * @return [type]            [description]
     */
    static public function getFileExtension($type): string {
        // TODO: make this better ?
        //  maybe get the files original extension :/
        return $type == 'image' ? 'png' : 'mp4';
    }


    /**
     * Store a newly uploaded file to the DB
     * @param  User   $user
     * @param  Post   $post
     * @param  string $caption  caption of the uploaded photo|video
     */
    static public function dbSave(User $user, Post $post, string $caption, array $paths): void {
        $post->user_id = $user->id;

        $post->caption = $caption;
        $post->post_url = json_encode($paths);
        $post->tags = json_encode(self::getHashTags($caption));
        $post->mentions = json_encode(self::getMentions($caption));

        $user->posts_count += 1;

        $user->save();
        $post->save();
    }


    /**
     * store file to disk/cloud
     * @param  string $file_name  name of file to save as
     * @param  string $file       content of file
     * 
     * @param  string $drive      storage drive to save to
     * @see                       config/filesystems.php
     * 
     * @return string             absolute path to file on disk/cloud
     */
    static public function storeFile(string $file_name, string $file, string $drive='google'): array {
        return [$file_name, $file_name];
        //~ Storage::disk($drive)->put($file_name, $file);
        //~ return [$file_name, Storage::disk($drive)->url($file_name)];
    }


    /**
     * increase the follow score of two people
     *
     * @param      \App\User  $user1  The user following
     * @param      int        $user2  The id of user beign followed
     */
    static public function updateFollowScore(User $user1, int $user2_id, string $action): void {
        $follow = UserFollow::where('user1_id', $user1->id)
                            ->where('user2_id', $user2_id)
                            ->first();
        if (!$follow) {
            // $user1 doesnt follow $user2
            // nothing to do
            return;
        }

        $map = [
            'post_like' => 0.01,      // 100 likes to get to 1   (from 0)
            'post_dislike' => -0.02,  // 50 dislikes to get to 0 (from 1)
            
            'comment' => 0.02,   // 50 comments to get to 1 (from 0)
            'uncomment' => -0.02,

            'comment_like' => 0.001,
            'comment_dislike' => -0.001,

            'save' => 0.002,
        ];

        // if (!array_key_exists($action, $map))
        //     return;

        $follow->follow_score += $map[$action];

        $follow->save();
    }
}
