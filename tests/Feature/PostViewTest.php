<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Post;

/*
 this tests makes sure that the user can
 * -view post(s)
 * -view news feed
 * -view post comments
 * 
*/


class PostViewTest extends TestCase
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
    public function user_can_view_post() {
        $response = $this->get(route('post.get', ['id'=>1]));
        $response->assertStatus(200);

        tap($response, function ($res) {
            $this->assertEquals('i and @donjoe', $res["caption"]);
            $this->assertEquals("[\"donjoe\"]", $res['mentions']);
            $this->assertEquals("johndoe", $res['username']);
            $this->assertEquals(0, $res['like_count']);
            $this->assertEquals(0, $res['auth_user_likes']);
            $this->assertEquals(0, $res['auth_user_saved']);
        });
    }

    /**
     * @test
     */
    public function post_upload_updates_news_feed() {
        // upload image
        $this->json("PUT", route('post.url_upload'), [
            'url' => env("TEST_IMAGE"),
            'caption' => "a picture of i and @donjoe"
        ]);
        $this->post(route('post.post_like', ['id'=>2])); // like it (post 2)
        $this->post(route('post.post_save', ['id'=>1])); // save post 1

        $response = $this->get(route('post.all_posts'));
        $response->assertStatus(200);

        $r0 = $response[0];
        tap($r0, function ($res) {
            $this->assertEquals('a picture of i and @donjoe', $res["caption"]);
            $this->assertEquals("[\"donjoe\"]", $res['mentions']);
            $this->assertEquals(0, $res['like_count']);
            $this->assertEquals(1, $res['auth_user_likes']);
            $this->assertEquals(0, $res['auth_user_saved']);
        });

        $r1 = $response[1];
        tap($r1, function ($res) {
            $this->assertEquals('i and @donjoe', $res['caption']);
            $this->assertEquals("[\"donjoe\"]", $res['mentions']);
            $this->assertEquals("johndoe", $res['username']);
            $this->assertEquals(0, $res['like_count']);
            $this->assertEquals(0, $res['auth_user_likes']);
            $this->assertEquals(1, $res['auth_user_saved']);
        });
    }

    /**
     * @test
     */
    public function user_can_search_post() {
        $response = $this->_get(route('post.all_posts'), "q=donjoe");
        $response->assertStatus(200);

        $r = $response[0];
        tap($r, function ($res) {
            $this->assertEquals('i and @donjoe', $res["caption"]);
            $this->assertEquals("[\"donjoe\"]", $res['mentions']);
            $this->assertEquals(0, $res['like_count']);
            $this->assertEquals("johndoe", $res['username']);
            $this->assertEquals(0, $res['auth_user_likes']);
            $this->assertEquals(0, $res['auth_user_saved']);
        });
    }

    /**
     * @test
     */
    public function user_can_view_comments() {
        $this->post(route('post.post_comment', ['id'=>1]), [
            'message' => "i am first to comment"
        ]); 
        $this->post(route('post.post_comment', ['id'=>1]), [
            'message' => "i am second to comment"
        ]); 
        $this->post(route('post.post_comment', ['id'=>1]), [
            'message' => "i am last to comment"
        ]);
        // like second comment
        $this->post(route('post.like_comment', ['id'=>2]));

        $response = $this->get(route('post.get_comments', ['id'=>1]));
        $response->assertStatus(200);

        tap($response[0], function ($res) {
            $this->assertEquals("i am second to comment", $res['message']);
            $this->assertEquals(1, $res['auth_user_likes']);
            $this->assertEquals(1, $res['likes']);
        });
        tap($response[1], function ($res) {
            $this->assertEquals("i am first to comment", $res['message']);
            $this->assertEquals("johndoe", $res['username']);
            $this->assertEquals(0, $res['likes']);
            $this->assertEquals(0, $res['auth_user_likes']);
        });
        tap($response[2], function ($res) {
            $this->assertEquals("i am last to comment", $res['message']);
            $this->assertEquals(0, $res['auth_user_likes']);
        });


        // get post 1
        $response = $this->get(route('post.get', ['id'=>1]));
        tap($response, function ($res) {
            $this->assertEquals("i am last to comment", $res["auth_user_comment"]);
        });
    }
}

