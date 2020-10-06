<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

use App\User;
use App\Post;
use App\Like;
use App\Comment;
use App\Bookmark;
use App\Notification;


use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => ['cors', 'json.response', 'throttle:60,1']], function () {
    ///////////////////
    // public routes //
    ///////////////////
    Route::post('/login', 'Auth\ApiAuthController@login')->name('login.api');
    Route::post('/register', 'Auth\ApiAuthController@register')->name('register.api');
    Route::get('/dl', 'PostController@download'); // TODO: move this

    // Post [READ]
    Route::get('/posts', 'PostController@getPosts')->name('post.all_posts');
    Route::get('/post/{id}/comments', 'PostController@getPostComments')->name('post.get_comments');
    Route::get('/post/{id}', 'PostController@getPost')->name('post.get');

    // User [READ]
    Route::get('/user/getprofile', 'UserController@getUser')->name('user.profile');
    Route::get('/users', 'UserController@getUsers')->name('user.all_users');
    Route::get('/user/{username}/posts', 'UserController@getUserPosts')->name('user.posts');
    Route::get('/user/{username}/mentions', 'UserController@getUserMentions')->name('user.mentions');
    Route::get('/user/{username}/bookmarks', 'UserController@getUserBookmarks')->name('user.bookmarks');
    Route::get('/user/{username}/followers', 'UserController@getUserFollowers')->name('user.followers');
    Route::get('/user/{username}/following', 'UserController@getUserFollowing')->name('user.following');


    /////////////////////////////////////////////////////////
    // [WRITE] Routes that anonymous users can also access //
    /////////////////////////////////////////////////////////
    Route::middleware('anonymous')->group(function () {
        Route::put('/post/upload', 'PostUploadController@UrlUpload')->name('post.url_upload');
        Route::post('/post/upload', 'PostUploadController@fileUpload')->name('post.file_upload');
        Route::post('/post/{id}/like', 'PostController@likePost')->name('post.post_like');
        Route::post('/post/{id}/dislike', 'PostController@dislikePost')->name('post.post_dislike');
        Route::post('/post/{id}/comment', 'CommentController@comment')->name('post.post_comment');
        Route::post('/comment/{id}/like', 'CommentController@likeComment')->name('post.like_comment');
        Route::post('/comment/{id}/dislike', 'CommentController@dislikeComment')->name('post.dislike_comment');

        Route::get('/test', function (Request $req) {
            return response($req->user());
        });

    });

    //////////////////////
    // protected routes //
    //////////////////////
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', 'Auth\ApiAuthController@logout')->name('logout.api');

        /////////////////
        // post routes //
        /////////////////
        //
        // CREATE, UPDATE, DELETE
        Route::post('/post/{id}/repost', 'PostController@rePost')->name('post.post_repost');
        Route::post('/post/{id}/save', 'PostController@savePost')->name('post.post_save');
        Route::post('/post/{id}/unsave', 'PostController@unsavePost')->name('post.post_unsave');
        Route::post('/post/{id}/update', 'PostController@updatePost')->name('post.post_update');
        Route::delete('/post/{id}', 'PostController@deletePost')->name('post.post_delete');
        Route::delete('/comment/{id}', 'CommentController@deleteComment')->name('post.delete_comment');


        /////////////////
        // user routes //
        /////////////////
        //
        //UPDATE, DELETE
        Route::post('/user/dp', 'UserController@updateDP')->name('user.dp_update');
        Route::post('/user/update', 'UserController@updateInfo')->name('user.update');
        Route::post('/user/password/update', 'UserController@updatePassword')->name('user.password.update');
        Route::post('/user/{username}/follow', 'UserController@followUser')->name('user.follow');
        Route::post('/user/{username}/unfollow', 'UserController@unfollowUser')->name('user.unfollow');
        Route::post('/user/notification/{id}', 'UserController@markNotification')->name('user.notification.mark');
        Route::delete('/user/notification/{id}', 'UserController@deleteNotification')->name('user.notification.delete');
        Route::post('/user/notifications/delete', 'UserController@deleteNotifications')->name('user.notifications.delete');
        // :auth_user:
        Route::get('/user/profile', 'UserController@getAuthUserProfile')->name('auth_user.profile');
        Route::get('/user/posts', 'UserController@getAuthUserPosts')->name('auth_user.posts');
        Route::get('/user/settings', 'UserController@getAuthUserSettings')->name('auth_user.settings');
        Route::get('/user/notifications', 'UserController@getAuthUserNotifications')->name('auth_user.notifications');
        Route::get('/user/bookmarks', 'UserController@getAuthUserBookmarks')->name('auth_user.bookmarks');
        Route::get('/user/mentions', 'UserController@getAuthUserMentions')->name('auth_user.mentions');
        //


        //////////
        // test //
        //////////

        // XXXX::all
        Route::get('/saved', function (Request $req) {return Bookmark::all();});
        Route::get('/notifs', function (Request $req) {return Notification::all();});
        Route::get('/comments', function (Request $req) {return Comment::all();});
        Route::get('/clr', function (Request $req) {
            // delete posts & notifs
            Like::where('user_id', '>', -1)->delete();
            Notification::where('notification_id', '>', -1)->delete();
            Comment::where('comment_id', '>', -1)->delete();
            // Post::where('post_id', '>', -1)->delete();
            return 'yapp';
        });
    });
});
