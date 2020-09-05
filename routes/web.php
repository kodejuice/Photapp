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


Route::get('/{path?}', function () {
    return view('app');
});

Route::get('/{a}/{b}', function () {
    return view('app');
});


// auth proctected routes
Route::middleware('auth.web')->group(function () {
    // upload file
    Route::post('/post/upload', 'PostUploadController@fileUpload')->name('post.file_upload');
});

