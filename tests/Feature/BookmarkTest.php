<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Bookmark;

/*
 this tests makes sure that the user can
 * -save posts
 * -unsave posts
 * 
*/


class BookmarkTest extends TestCase
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
        $login = $this->post(route('login.api'), [
          'username' => 'johndoe',
          'password' => '123456',
        ]);

        $this->withHeader('Authorization', 'Bearer ' . $login['token']);
        
        // post
        $this->json("PUT", route('post.url_upload'), [
            'url' => env("TEST_IMAGE"),
        ]);
    }

    public function tearDown(): void
    {
        $this->artisan('migrate:reset');
    }


    /**
     * @test
     */
    public function user_can_save_post() {
        $response = $this->post(route('post.post_save', ['id'=>1]));
        $response->assertStatus(200);

        $this->assertCount(1, Bookmark::all());

        tap(Bookmark::first(), function ($bmark) {
            $this->assertEquals(1, $bmark->post_id);
        });

        $this->user_can_unsave_post();
    }

    private function user_can_unsave_post() {
        $response = $this->post(route('post.post_unsave', ['id'=>1]));
        $response->assertStatus(200);

        $this->assertCount(0, Bookmark::all());
    }    
}
