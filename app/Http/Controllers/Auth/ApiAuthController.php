<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\User;
use App\UserSetting;
use App\UserFollow;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordReset;

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


    /**
     * password reset request
     *
     * @param      $request  The request
     * @return
     */
    public function validatePasswordRequest(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:50',
        ]);

        if ($validator->fails()) {
            return response(['errors'=>$validator->errors()->all()], 422);
        }

        $email = $request->email;
        $user = User::firstWhere('email', $email);

        // Check if the user exists
        if (!$user) {
            return response(['errors' => ['User does not exist']]);
        }

        // Delete previous token
        $prev = DB::table('password_resets')->where('email', $email);
        if ($prev) $prev->delete();

        // Create Password Reset Token
        DB::table('password_resets')->insert([
            'email' => $email,
            'token' => str_random(60),
            'created_at' => Carbon::now()
        ]);

        // Get the token just created above
        $tokenData = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if ($this->sendResetEmail($email, $tokenData->token)) {
            // A reset link has been sent to your email address.
            return response(['message' => 'Success']);
        } else {
            return response(['errors' => ['An Error occured. Please try again.']]);
        }
    }

    /**
     * send reset email to the user
     */
    private function sendResetEmail($email, $token) {
        //Retrieve the user from the database
        $user = User::firstWhere('email', $email);

        //Generate, the password reset link. The token generated is embedded in the link
        $link = env('APP_URL') . '/password/reset/' . $token . '?email=' . urlencode($user->email);

        try {

            Mail::to($email)
                ->send(new PasswordReset($user, $link));

            return true;

        } catch (\Exception $e) {
            return false;
        }
    }


    /**
     * reset password
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    public function resetPassword(Request $request)
    {
        //Validate input
        $validator = Validator::make($request->all(), [
            'password' => 'required|confirmed',
            'token' => 'required'
        ]);

        //check if payload is valid before moving on
        if ($validator->fails()) {
            return response(['errors'=>$validator->errors()->all()], 422);
        }

        $token = $request->token;
        $password = $request->password;

        // Validate the token
        $tokenData = DB::table('password_resets')
            ->where('token', $token)->first();

        if (!$tokenData) {
            return response(['errors'=>['Invalid token (or token expired)']], 422);
        }

        $user = User::where('email', $tokenData->email)->first();
        if (!$user) {
            return response(['errors'=>['User with that email not found']], 422);
        }

        // check if token is expired
        $d = Carbon::parse($tokenData->created_at);
        if ($d->diffInMinutes() > 30) { // expired
            DB::table('password_resets')->where('email', $user->email)->delete();

            return response(['errors'=>['Invalid token (token expired)']], 422);
        }

        //Hash and update the new password
        $user->password = \Hash::make($password);
        $user->save();

        //Delete the token
        DB::table('password_resets')->where('email', $user->email)->delete();

        return response(['message' => 'Success', 'username' => $user->username]);
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
