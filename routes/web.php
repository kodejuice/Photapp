<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// proctected routes
Route::middleware('auth:api')->group(function () {
    Route::post('/post/upload', 'PostUploadController@fileUpload')->name('post.file_upload');
});


// web routes
Route::get('/{path?}', function () {
    return view('app');
});
