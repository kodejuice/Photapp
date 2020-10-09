<?php

namespace App\Listeners;

use App\Events\NewsFeedRequested;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\User;
use App\Post;
use App\NewsFeed;

class UpdateNewsFeed implements ShouldQueue
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

    public function shouldQueue(NewsFeedRequested $event)
    {
        $feed = NewsFeed::all();
        $posts = Post::all();

        return count($posts) != count($feed);
    }


    /**
     * Handle the event.
     *
     * @param  NewsFeedRequested  $event
     * @return void
     */
    public function handle(NewsFeedRequested $event)
    {
        // sort posts by popularity and recency

        $N = 100;
        $last_pid = Post::orderByDesc('post_id')->first()->post_id; // last post id

        /**
         * this orders the result as such that for the latest N posts are
         * sorted based on `post_id + (like_count + comment_count)`, then the N posts before that
         * are sorted based on `post_id + (like_count + comment_count)/2`, the N before that are divided 4,
         *  then 8, 16, 32, ... and so on
         */
        $query = <<<sql
1=1
ORDER BY
  post_id
  +
  (like_count + comment_count) / POWER(2, (($last_pid - post_id) / $N) - 1)
DESC
sql;

        $posts = Post::whereRaw($query)->get();

        // $posts = Post::whereRaw('1=1 ORDER BY like_count + post_id DESC')->get();

        DB::statement('TRUNCATE TABLE news_feed');

        foreach ($posts as $p) {
            NewsFeed::create([
                'post_id' => $p->post_id,
                'user_id' => $p->user_id,
                'post_url' => $p->post_url,
                'media_type' => $p->media_type,
                'caption' => $p->caption,
                'tags' => $p->tags,
                'mentions' => $p->mentions,
                'like_count' => $p->like_count,
                'comment_count' => $p->comment_count,
                'created_at' => $p->created_at,
            ]);
        }
    }
}
