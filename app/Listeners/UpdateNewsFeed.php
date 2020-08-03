<?php

namespace App\Listeners;

use App\Events\NewsFeedRequested;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Support\Facades\DB;

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
        $top = NewsFeed::first();
        if (!$top) {
            return true;
        }

        $latest = Post::orderByDesc('post_id')->first();

        return $latest->post_url != $top->post_url;
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

        $N = count(User::all()) >> 1;
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

        $posts = Post::whereRaw($query);

        // $posts = Post::whereRaw('1=1 ORDER BY like_count + post_id DESC')->get();

        DB::statement('TRUNCATE TABLE news_feed');

        foreach ($posts as $p) {
            NewsFeed::create([
                'post_id' => $p->post_id,
                'user_id' => $p->user_id,
                'post_url' => $p->post_url,
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
