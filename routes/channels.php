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

// TODO: check if user wants such notifications (in `UserSettings` table)

if (!function_exists('broadcast_auth_logic')) {
    // i have a feeling this isnt bad code :/
    function broadcast_auth_logic($user, $id) {
        return (int) $user->id === (int) $id;
    }
}

$auth_guard = ['guards' => ['api']];

Broadcast::channel('comment.{id}', "broadcast_auth_logic", $auth_guard);
Broadcast::channel('post.{id}', "broadcast_auth_logic", $auth_guard);
Broadcast::channel('mention.{id}', "broadcast_auth_logic", $auth_guard);
Broadcast::channel('follow.{id}', "broadcast_auth_logic", $auth_guard);
