<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="robots" content="noimageindex, noarchive">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="theme-color" content="#ffffff">
        <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover">
        <link rel="stylesheet" type="text/css" href="{{ asset('/css/app.css') }}">

        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('/favicon/apple-touch-icon.png') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('/favicon/favicon-32x32.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('/favicon/favicon-16x16.png') }}">
        <link rel="manifest" href="{{ asset('/manifest/manifest.json') }}">

        <meta property="og:site_name" content="PhotApp">
        <meta property="og:title" content="PhotApp">
        <meta property="og:image" content="{{ asset('/favicon/android-chrome-192x192.png') }}">

        <meta property="og:url" content="{{ asset('') }}">
        <link rel="canonical" href="{{ asset('') }}">

        <meta content="A simple, fun photo and video sharing social network." name="description">
        <meta content="Biereagu Sochima" name="author">

        <title>PhotApp</title>
    </head>
    <body>
        <div id="root"> </div>
        <noscript>
            <p> JavaScript is disabled in your browser, enable it or PhotApp won't be rendered! </p>
        </noscript>

        <script src="{{ asset('/js/app.js') }}"></script>

        <script>
            if ('serviceWorker' in navigator ) {
                window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                        console.log('ServiceWorker registration failed: ', err);
                    });
                });
            }
        </script>

    </body>
</html>
