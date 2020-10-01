<?php

use Illuminate\Support\Facades\Broadcast;

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

function auth_logic($user, $id) {
    return (int) $user->id === (int) $id;
}

$auth_guard = ['guards' => ['api']];

Broadcast::channel('comment.{id}', "auth_logic", $auth_guard);
Broadcast::channel('post.{id}', "auth_logic", $auth_guard);
Broadcast::channel('mention.{id}', "auth_logic", $auth_guard);
Broadcast::channel('follow.{id}', "auth_logic", $auth_guard);
