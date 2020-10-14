<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

use App\User;

class PasswordReset extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected User $user;
    protected string $reset_link;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user, string $reset_link)
    {
        $this->user = $user;
        $this->reset_link = $reset_link;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.password-reset')
                    ->subject('PhotApp Password Reset')
                    ->with([
                        'user' => $this->user,
                        'reset_link' => $this->reset_link
                    ]);
    }
}
