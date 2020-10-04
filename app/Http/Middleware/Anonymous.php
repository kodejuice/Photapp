<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;

use App\User;

class Anonymous extends Middleware
{
    private $token_client = 'authToken';

    // return @ANON_USER's login token
    private function anonLoginToken(): string
    {
        $user = User::firstWhere('username', env("ANON_USER"));
        if (!$user) return "";
        $token = $user->createToken($this->token_client)->accessToken;
        return $token;
    }

    public function handle($request, Closure $next)
    {
        $auth_user = $request->user();

        // user already logged in
        if ($auth_user) {
            return $next($request);
        }

        // else, use @ANON_USER's login token
        $request->headers->set(
            'Authorization',
            'Bearer ' . $this->anonLoginToken()
        );

        if ($this->auth->guard('api')->check()) {
            $this->auth->shouldUse('api');
            return $next($request);
        }

        return response(['errors' => ["Authentication required"]]);
    }
}
