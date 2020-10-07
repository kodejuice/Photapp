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

class UserMentioned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int    $post_id;
    public User   $who_mentioned;
    public string $mentioned_user;
    public string $comment_message;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(string $mentioned, User $mentioner, int $post_id, string $comment_message)
    {
        $this->post_id = $post_id;
        $this->who_mentioned = $mentioner;
        $this->mentioned_user = $mentioned;
        $this->comment_message = $comment_message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        $mentioned = User::firstWhere('username', $this->mentioned_user);
        return new Channel('mention.' . $mentioned->id);
    }
}
