<?php

use Illuminate\Support\Facades\Broadcast;

use App\User;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

if (!function_exists('broadcast_auth_logic')) {
    function broadcast_auth_logic(User $user, $id) {
        return $user->id === (int) $id;
    }
}

$auth_guard = ['guards' => ['api']];

Broadcast::channel('comment.{id}', "broadcast_auth_logic");
Broadcast::channel('post.{id}', "broadcast_auth_logic");
Broadcast::channel('mention.{id}', "broadcast_auth_logic");
Broadcast::channel('follow.{id}', "broadcast_auth_logic");
