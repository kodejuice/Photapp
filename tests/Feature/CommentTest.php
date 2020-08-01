<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use Illuminate\Support\Facades\Log;

use App\User;
use App\Comment;
use App\Notification;


/*
 this tests makes sure that the user can
 * -comment
 * -like comment
 * -dislike comment
 * -delete comment
 * 
*/


class CommentTest extends TestCase
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
        $this->post(route('register.api'), [
            'full_name' => "Doe John",
            'username' => 'doejohn',
            'email' => 'doejohn@example.com',
            'password' => '123456',
            'password_confirmation' => '123456'
        ]);

        $login = $this->post(route('login.api'), [
          'username' => 'johndoe',
          'password' => '123456',
        ]);

        $token = $login['token'];
        $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->json("PUT", route('post.url_upload'), [
                'url' => env("TEST_IMAGE"),
            ]);
        // @johndoe makes the request
    }

    public function tearDown(): void
    {
        $this->artisan('migrate:reset');
    }


    /**
     * @test
     */
    public function user_can_comment() {
        $response = $this->post(route('post.post_comment', ['id'=>1]), [
            'message' => "@doejohn come see this stuff",
        ]);
        $response->assertStatus(200);

        $this->assertCount(1, Comment::all());

        tap(Comment::first(), function ($c) {
            $this->assertEquals("@doejohn come see this stuff", $c->message);
            $this->assertEquals(1, $c->user_id);
            $this->assertEquals(1, $c->comment_id);
            $this->assertEquals('johndoe', User::where('id', $c->user_id)->first()->username);
        });

        /**
         * make sure @doejohn is notified
         */
        $this->users_mentioned_are_notified();
    }


    private function users_mentioned_are_notified() {
        //~ Log::info(Notification::all());
        $this->assertCount(1, Notification::all());

        tap(Notification::first(), function ($c) {
            $this->assertEquals('mention', $c->type);
            $this->assertEquals(User::where('username', 'doejohn')->first()->id, $c->user_id);
        });

        /**
         * make sure user can like comment
         */
        $this->user_can_like_comment();
    }


    private function user_can_like_comment() {
        $response = $this->post(route('post.like_comment', ['id'=>1]));
        $response->assertStatus(200);

        tap(Comment::first(), function ($c) {
            $this->assertEquals(1, $c->likes);
        });

        /**
         * make sure user can dislike comment
         */
        $this->user_can_dislike_comment();
    }


    private function user_can_dislike_comment() {
        $response = $this->post(route('post.dislike_comment', ['id'=>1]));
        $response->assertStatus(200);

        tap(Comment::first(), function ($c) {
            $this->assertEquals(0, $c->likes);
        });

        /**
         * make sure user can delete comment
         */
        $this->user_can_delete_comment();
    }


    private function user_can_delete_comment() {
        $response = $this->delete(route('post.delete_comment', ['id'=>1]));
        $response->assertStatus(200);

        $this->assertCount(0, Comment::all());
    }
}

