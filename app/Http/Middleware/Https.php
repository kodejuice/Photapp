<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class Https
{
    /**
     * Handle an incoming request.
     *  redirect http to https if in production
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
            if (!$request->secure() && App::environment() === 'production') {
                // $request->setTrustedProxies( [ $request->getClientIp() ], Request::HEADER_X_FORWARDED_ALL); 
                return redirect()->secure($request->getRequestUri());
            }

            return $next($request); 
    }
}
