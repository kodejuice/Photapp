<?php

namespace App\Listeners;

use App\Events\NewsFeedRequested;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Support\Facades\DB;

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
        if (!$top) return true;

        $latest = $posts = Post::orderByDesc('created_at')->first();

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
        DB::statement('TRUNCATE TABLE news_feed');

        $posts = Post::orderByDesc('created_at')
                    ->get();

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
