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

class UserDPChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public User $user;
    public string $image;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(User $user, string $image)
    {
        $this->user = $user;
        $this->image = $image;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('channel-name');
    }
}
