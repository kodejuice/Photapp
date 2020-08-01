<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

use App\User;

class RegisterUserTest extends TestCase
{
    use RefreshDatabase;

    public string $token;


    public function setUp(): void
    {
        parent::setUp();

        $this->artisan('migrate');
        $this->artisan('passport:install');
    }

    public function tearDown(): void
    {
        $this->artisan('migrate:reset');
    }


    /**
     * @test
     */
    public function user_can_register_and_login()
    {
        $response = $this->post(route('register.api'), [
            'full_name' => "John Doe",
            'username' => 'johndoe',
            'email' => 'johndoe@example.com',
            'password' => '123456',
            'password_confirmation' => '123456'
        ]);

        $this->assertCount(1, User::all());

        tap(User::first(), function ($user) {
            $this->assertEquals('John Doe', $user->full_name);
            $this->assertEquals('johndoe', $user->username);
            $this->assertEquals('johndoe@example.com', $user->email);
            $this->assertTrue(Hash::check('123456', $user->password));
        });

        $response->assertStatus(200);

        /**
         * make sure login also works
         */
        $this->user_can_login();
    }


    public function user_can_login()
    {
        $response = $this->post(route('login.api'), [
            'username' => 'johndoe',
            'password' => '123456',
        ]);

        $response->assertStatus(200);

        /**
         * make sure logout also works
         */
        $this->user_can_logout($response['token']);
    }


    public function user_can_logout(string $token)
    {
        $response = $this
            ->withHeader('Authorization', 'Bearer ' . $token)
            ->json("POST", route('logout.api'));

        $response->assertStatus(200);
    }

}

