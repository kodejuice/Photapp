<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

use Closure;

class Authenticate extends Middleware
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

        $this->authenticate($request, $guards);

        return $next($request);
    }


    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        if (! $request->expectsJson()) {
            return route('login');
        }
    }
}
