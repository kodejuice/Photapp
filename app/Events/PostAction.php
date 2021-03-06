<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

use Illuminate\Support\Facades\Log;

use App\User;
use App\Post;

class PostAction implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    
    public User $user;
    public Post $post;
    public string $action; // 'like' or 'comment'
    public string $comment_message;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(User $user, Post $post, string $action, string $msg="")
    {
        $this->user = $user;
        $this->post = $post;
        $this->action = $action;
        $this->comment_message = $msg;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {

        return new PrivateChannel('post.' . $this->post->user_id);
    }
}
