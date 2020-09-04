<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;

class CookieAuth extends Middleware
{

    /**
     * check if the cookie AUTH_TOKEN is present, if so then set it as our bearer token
     * since the browser automatically includes the cookie with every request
     * we dont have to manually set the header in the client side
     *
     * @param      <type>   $request    The request
     * @param      Closure  $next       next middleware
     * @param      <type>   ...$guards  guards
     *
     */
    public function handle($request, Closure $next, ...$guards)
    {
        if ($request->cookie('AUTH_TOKEN')) {
            $request->headers->set('Authorization', 'Bearer ' . $request->cookie('AUTH_TOKEN'));
        }

        // $this->authenticate($request, ['api']);
        if ($this->auth->guard('api')->check()) {
            $this->auth->shouldUse('api');
        }

        return $next($request);
    }
}
