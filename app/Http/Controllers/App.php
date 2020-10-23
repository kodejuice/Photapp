<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class App extends Controller
{
    public function __construct()
    {
        // $this->middleware('forceSSL');
    }

    public function index(Request $request)
    {
        return view('app');
    }
}
