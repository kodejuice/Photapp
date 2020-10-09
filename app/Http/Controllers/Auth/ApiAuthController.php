<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\User;
use App\UserSetting;
use App\UserFollow;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ApiAuthController extends Controller
{
    private $token_client = 'authToken';

    /**
     * User signup
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'max:50',
            'username' => 'required|string|max:27|min:4|unique:users',
            'email' => 'required|string|email|max:50|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response(['errors'=>$validator->errors()->all()], 422);
        }

        $request['password'] = Hash::make($request['password']);
        $request['remember_token'] = Str::random(10);

        $user = User::create($request->toArray());
        UserSetting::create(['user_id' => $user->id]);

        $this->setupFollows($user->username);

        $token = $user->createToken($this->token_client)->accessToken;

        $response = ['token' => $token];
        return response($response, 200);
    }


    /**
     * User signin
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:27',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response(['errors'=>$validator->errors()->all()], 422);
        }

        $user = User::where('username', $request->username)->first();
        if ($user) {
            if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken($this->token_client)->accessToken;
                $response = ['token' => $token];
                return response($response, 200);
            } else {
                $response = ["message" => "Incorrect password"];
                return response($response, 422);
            }
        } else {
            $response = ["message" =>'User does not exist'];
            return response($response, 422);
        }
    }


    /**
     * User logout
     */
    public function logout(Request $request)
    {
        $token = $request->user()->token();
        $token->revoke();
        $response = ['message' => 'You have been successfully logged out!'];
        return response($response, 200);
    }


    /////////////////
    // User Follow //
    /////////////////

    // @ANON_USER follows regd user
    // reg user follows @ANON

    private function userFollow($user1_name, $user2_name) {
        $user1 = User::firstWhere('username', $user1_name);
        $user2 = User::firstWhere('username', $user2_name);

        if (!$user1 || !$user2) {
            return;
        }

        $follows = UserFollow::where('user1_id', $user1->id)->where('user2_id', $user2->id);
        if ($follows->first() || $user1->username == $user2->username) {
            return;
        }

        $follow = new UserFollow();
        $follow->user1_id = $user1->id;
        $follow->user2_id = $user2->id;

        $user1->follows += 1;
        $user1->save();

        $user2->followers += 1;
        $user2->save();

        $follow->save();
    }


    /**
     * follow @ANON_USER
     */
    private function setupFollows($username) {
        $anon = env("ANON_USER");

        $this->userFollow($anon, $username);
        $this->userFollow($username, $anon);
    }
}
