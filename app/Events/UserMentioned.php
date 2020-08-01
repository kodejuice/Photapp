<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

use App\User;
use App\Post;

class UserMentioned
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int    $post_id;
    public User   $who_mentioned;
    public string $mentioned_user;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(string $mentioned, User $mentioner, int $post_id)
    {
        $this->post_id = $post_id;
        $this->who_mentioned = $mentioner;
        $this->mentioned_user = $mentioned;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
