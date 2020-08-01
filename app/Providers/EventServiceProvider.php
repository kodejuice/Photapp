<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        'App\Events\NewsFeedRequested' => [
            'App\Listeners\UpdateNewsFeed'
        ],

        'App\Events\UserMentioned' => [
            'App\Listeners\NotifyMentionedUser',
        ],

        'App\Events\UserFollowed' => [
            'App\Listeners\NotifyFollowedUser',
        ],

        'App\Events\FileUploaded' => [
            'App\Listeners\MoveFileToCloud',
        ],

        'App\Events\PostAction' => [
            'App\Listeners\NotifyPostAuthor',
        ],

        'App\Events\CommentAction' => [
            'App\Listeners\NotifyCommentAuthor',
        ],

    ];


    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
