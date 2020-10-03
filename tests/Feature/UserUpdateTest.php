<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

use App\User;
use App\Comment;
use App\UserSetting;
use App\UserFollow;
use App\Notification;

/*
 this tests makes sure that the user can
 * -follow another
 * -unfollow another
 * -update their info
 * -update settings
 *
*/

define('DATE', date("Y-m-d"));


class UserUpdateTest extends TestCase
{
    use RefreshDatabase;

    private object $user1_login;
    private object $user2_login;

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
            'full_name' => "Doe John",
            'username' => 'doejohn',
            'email' => 'doejohn@example.com',
            'password' => '123456',
            'password_confirmation' => '123456'
        ]);

        $this->user1_login = $this->post(route('login.api'), [
          'username' => 'johndoe',
          'password' => '123456',
        ]);

        $this->user2_login = $this->post(route('login.api'), [
          'username' => 'doejohn',
          'password' => '123456',
        ]);
    }

    public function tearDown(): void
    {
        $this->artisan('migrate:reset');
    }



    /**
     * @test
     */
    public function user_can_update_info()
    {
        $response = $this->json("POST", route('user.update'), [
            'full_name' => "Real John Doe",
            'password' => '123456'
        ], [
            'Authorization' => 'Bearer ' . $this->user1_login['token']
        ]);
        $response->assertStatus(200);

        tap(User::first(), function ($user) {
            $this->assertEquals("Real John Doe", $user->full_name);
        });
    }

    /**
     * @test
     */
    public function user_can_update_bio()
    {
        $response = $this->post(route('user.update'), [
            'full_name' => "Real John Doe",
            'bio' => "mehn i'm tired",
            'password' => '123456'
        ], [
            'Authorization' => 'Bearer ' . $this->user1_login['token']
        ]);
        $response->assertStatus(200);

        tap(User::first(), function ($user) {
            $this->assertEquals("Real John Doe", $user->full_name);
            $this->assertEquals("mehn i'm tired", $user->bio);
        });
    }

    /**
     * @test
     */
    public function user_can_update_password()
    {
        $response = $this->post(route('user.password.update'), [
            'old_password' => '123456',
            'new_password' => '654321'
        ], [
            'Authorization' => 'Bearer ' . $this->user1_login['token']
        ]);
        $response->assertStatus(200);

        tap(User::firstWhere('id', 1), function ($user) {
            $this->assertTrue(Hash::check("654321", $user->password), "test fail: password didn't update");
        });
    }

    /**
     * @test
     */
    public function user_can_update_dob()
    {
        $response = $this->post(route('user.update'), [
            'full_name' => "Real John Doe",
            'bio' => "mehn i'm tired",
            'dob' => DATE,
            'password' => '123456'
        ], [
            'Authorization' => 'Bearer ' . $this->user1_login['token']
        ]);
        $response->assertStatus(200);

        tap(User::first(), function ($user) {
            $this->assertEquals("Real John Doe", $user->full_name);
            $this->assertEquals("mehn i'm tired", $user->bio);
            $this->assertEquals(DATE, $user->dob);
        });
    }

    /**
     * @test
     */
    public function user_can_update_settings()
    {
        $response = $this->post(route('user.update'), [
            'notify_post_likes' => 1,
            'notify_comments_likes' => 0,
            'notify_comments' => 1,
            'notify_mentions' => 0,
            'notify_follows' => 1,
        ], [
            'Authorization' => 'Bearer ' . $this->user1_login['token']
        ]);
        $response->assertStatus(200);

        tap(UserSetting::first(), function ($set) {
            $this->assertEquals(1, $set->notify_post_likes);
            $this->assertEquals(0, $set->notify_comments_likes);
            $this->assertEquals(1, $set->notify_comments);
            $this->assertEquals(0, $set->notify_mentions);
            $this->assertEquals(1, $set->notify_follows);
        });
    }


    /**
     * @test
     */
    public function user_can_follow_and_unfollow_user()
    {
        $response = $this->json("POST", route('user.follow', ['username'=>'doejohn']), [], [
            'Authorization' => 'Bearer ' . $this->user1_login['token']
        ]);
        $response->assertStatus(200);

        tap(User::first(), function ($user) {
            $this->assertEquals(1, $user->follows);
        });
        tap(User::where('username', 'doejohn')->first(), function ($user) {
            $this->assertEquals(1, $user->followers);
        });

        tap(UserFollow::first(), function ($fllw) {
            $this->assertEquals(1, $fllw->user1_id);
            $this->assertEquals(2, $fllw->user2_id);
        });

        $this->user_can_receive_fllw_alerts();
    }

    private function user_can_receive_fllw_alerts()
    {
        tap(Notification::first(), function ($notif) {
            $this->assertEquals(1, $notif->new);
            $this->assertEquals('follow', $notif->type);
            $this->assertEquals(2, $notif->user_id);
            $this->assertEquals('johndoe', $notif->associated_user);
        });

        $this->user_can_unfollow_user();
    }

    private function user_can_unfollow_user()
    {
        $response = $this
            ->post(route('user.unfollow', ['username'=>'doejohn']), [], [
                'Authorization' => 'Bearer ' . $this->user1_login['token']
            ]);
        $response->assertStatus(200);

        tap(User::first(), function ($user) {
            $this->assertEquals(0, $user->follows);
        });
        tap(User::where('username', 'doejohn')->first(), function ($user) {
            $this->assertEquals(0, $user->followers);
        });

        $this->assertCount(0, UserFollow::all());
    }
}
