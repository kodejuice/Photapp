<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\User;
use App\Post;
use App\Bookmark;
use App\Notification;

use Illuminate\Support\Facades\Storage;

/*
 this tests makes sure that the user can
 * -upload
 * -modify post captions
 * -like posts
 * -dislike posts
 * -delete post
 * 
*/


class FileUploadTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->artisan('migrate:fresh');
        $this->artisan('passport:install');

        // user1
        $this->post(route('register.api'), [
            'full_name' => "John Doe",
            'username' => 'johndoe',
            'email' => 'johndoe@example.com',
            'password' => '123456',
            'password_confirmation' => '123456'
        ]);
        // user2
        $this->post(route('register.api'), [
            'full_name' => "Doe John",
            'username' => 'doejohn',
            'email' => 'doejohn@example.com',
            'password' => '123456',
            'password_confirmation' => '123456'
        ]);

        $doejohn_login = $this->post(route('login.api'), [
          'username' => 'doejohn',
          'password' => '123456',
        ]);

        $this->withHeader('Authorization', 'Bearer ' . $doejohn_login['token']);
    }

    public function tearDown(): void
    {
        $this->artisan('migrate:reset');
    }


    /**
     * @test
     */
    public function user_can_upload_file()
    {
        $response = $this
            ->json("PUT", route('post.url_upload'), [
                'url' => env("TEST_IMAGE"),
                'caption' => "i am not @johndoe"
            ]);
        // doejohn makes the request

        $this->assertCount(1, Post::all());

        tap(Post::first(), function ($post) {
            $this->assertEquals(1, $post->post_id);
            $this->assertEquals('i am not @johndoe', $post->caption);
            $this->assertEquals('doejohn', User::firstWhere('id', $post->user_id)->username);
        });

        $response->assertStatus(200);

        /**
         * make sure user can receive notification
         */
        $this->user_can_receive_mention_notification();
    }


    private function user_can_receive_mention_notification() {
        tap(Notification::first(), function($notif) {
            $this->assertEquals(1, $notif->post_id);
            $this->assertEquals('mention', $notif->type);
            $this->assertEquals('doejohn mentioned you in a post', $notif->message);
            $this->assertEquals('johndoe', User::firstWhere('id', $notif->user_id)->username);
        });

        /**
         * make sure user can update caption
         */
        $this->user_can_update_caption();
    }


    private function user_can_update_caption() {
        $response = $this->post(route('post.post_update', ['id'=>1]), [
            'caption' => "maybe i'm not",
        ]);
        $response->assertStatus(200);

        tap(Post::first(), function ($post) {
            $this->assertEquals("maybe i'm not", $post->caption);
        });

        /**
         * make sure user can like post
         */
         $this->user_can_like_post();
    }

    private function user_can_like_post() {
        $response = $this->post(route('post.post_like', ['id'=>1]));
        $response->assertStatus(200);

        tap(Post::first(), function ($post) {
            $this->assertEquals(1, $post->like_count);
        });

        /**
         * make sure user can unlike post
         */
        $this->user_can_dislike_post();
    }


    private function user_can_dislike_post() {
        $response = $this->post(route('post.post_dislike', ['id'=>1]));
        $response->assertStatus(200);

        tap(Post::first(), function ($post) {
            $this->assertEquals(0, $post->like_count);
        });

        /**
         * make sure user can delete post
         */
        $this->user_can_delete_post();        
    }


    private function user_can_delete_post() {
        $response = $this->delete(route('post.post_delete', ['id'=>1]));
        $response->assertStatus(200);

        $this->assertCount(0, Post::all());
        $this->assertCount(0, Storage::files('.'));
    }
}
