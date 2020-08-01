<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use Illuminate\Support\Facades\Log;

use App\User;
use App\Comment;
use App\UserSetting;
use App\UserFollow;
use App\Notification;


/*
 this tests makes sure that the user can
 * -view profile(s)
 * -view user posts
 * -view user following/followers
 * -view user bookmarks
 * -view user mentions
 * -view user settings
 * 
*/


class UserViewTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');
        $this->artisan('passport:install');

        // user_id -> 1
        $this->post(route('register.api'), [
            'full_name' => "John Doe",
            'username' => 'johndoe',
            'email' => 'johndoe@example.com',
            'password' => '123456',
            'password_confirmation' => '123456'
        ]);
        // user_id -> 2
        $this->post(route('register.api'), [
            'full_name' => "Don Joe",
            'username' => 'donjoe',
            'email' => 'donjoe@example.com',
            'password' => '123456',
            'password_confirmation' => '123456'
        ]);

        $login = $this->post(route('login.api'), [
          'username' => 'johndoe',
          'password' => '123456',
        ]);

        // add auth header to subsequent requests
        $this->withHeader('Authorization', 'Bearer ' . $login['token']);

        // upload image
        $this->json("PUT", route('post.url_upload'), [
            'url' => env("TEST_IMAGE"),
            'caption' => "i and @donjoe"
        ]);

        // save
        $this->post(route('post.post_save', ['id'=>1]));
    }

    public function tearDown(): void
    {
        $this->artisan('migrate:reset');
    }

    private function _get($route, $body) {
        return $this->get($route . "?$body");
    }


    /**
     * @test
     */
    public function user_can_view_profile() {
        $response = $this->_get(route('user.profile'), 'username=johndoe');
        $response->assertStatus(200);

        tap($response, function ($res) {
            $this->assertEquals("John Doe", $res['full_name']);
            $this->assertEquals("johndoe@example.com", $res['email']);
            $this->assertEquals("johndoe", $res['username']);
            $this->assertEquals(0, $res['auth_user_follows']);
        });
    }

    /**
     * @test
     */
    public function user_can_view_profiles() {
        $response = $this->get(route('user.all_users'));

        $user1 = $response[0];
        tap($user1, function ($res) {
            $this->assertEquals("John Doe", $res['full_name']);
            $this->assertEquals("johndoe@example.com", $res['email']);
            $this->assertEquals("johndoe", $res['username']);
            $this->assertEquals(0, $res['auth_user_follows']);
        });

        $user2 = $response[1];
        tap($user2, function ($res) {
            $this->assertEquals("Don Joe", $res['full_name']);
            $this->assertEquals("donjoe@example.com", $res['email']);
            $this->assertEquals("donjoe", $res['username']);
            $this->assertEquals(0, $res['auth_user_follows']);
        });

        // user search
        $response = $this->_get(route('user.all_users'), "q=don");

        $user = $response[0];
        tap($user, function ($res) {
            $this->assertEquals("Don Joe", $res['full_name']);
            $this->assertEquals("donjoe@example.com", $res['email']);
            $this->assertEquals("donjoe", $res['username']);
        });
    }

    /**
     * @test
     */
    public function user_can_view_post() {
        $response = $this->get(route('user.posts', ['username' => 'johndoe']));
        $response->assertStatus(200);

        $post = $response[0];
        tap($post, function ($res) {
            $this->assertEquals("i and @donjoe", $res['caption']);
        });
    }

    /**
     * @test
     */
    public function user_can_view_followers_and_following() {
        // follow donjoe first
        $this->post(route('user.follow', ['id'=>2]))
            ->assertStatus(200);

        // followers
        $response = $this->get(route('user.followers', ['username'=>'donjoe']));
        $response->assertStatus(200);
        tap($response[0], function ($res) {
            $this->assertEquals("johndoe", $res['username']);
        });

        // following
        $response = $this->get(route('user.following', ['username'=>'johndoe']));
        $response->assertStatus(200);
        tap($response[0], function ($res) {
            $this->assertEquals("donjoe", $res['username']);
            $this->assertEquals(1, $res['auth_user_follows']);
        });
    }

    /**
     * @test
     */
    public function user_can_view_saved_bookmarks() {
        $response = $this->get(route('auth_user.bookmarks'));
        $response->assertStatus(200);

        tap($response[0], function ($res) {
            $this->assertEquals("i and @donjoe", $res['caption']);
        });
    }

    /**
     * @test
     */
    public function user_can_view_mentions() {
        $response = $this->get(route('user.mentions', ['username' => 'donjoe']));
        $response->assertStatus(200);

        tap($response[0], function ($res) {
            $this->assertEquals("i and @donjoe", $res['caption']);
        });
    }

    /**
     * @test
     */
    public function user_can_view_settings() {
        $response = $this->get(route('auth_user.settings'));
        $response->assertStatus(200);

        tap($response, function ($res) {
            $this->assertEquals(1, $res['notify_post_likes']);
            $this->assertEquals(1, $res['notify_comments_likes']);
            $this->assertEquals(1, $res['notify_comments']);
            $this->assertEquals(1, $res['notify_mentions']);
            $this->assertEquals(1, $res['notify_follows']);
        });
    }

}
