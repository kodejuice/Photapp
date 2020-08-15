<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="{{ asset('css/app.css') }}">

        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('favicon/apple-touch-icon.png') }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('favicon/favicon-32x32.png') }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('favicon/favicon-16x16.png') }}">
        <link rel="manifest" href="{{ asset('favicon/site.webmanifest') }}">

        <title>PhotApp</title>
    </head>
    <body>
        <div id="root"> </div>

        <!-- <script src="{{ asset('js/app.js') }}"></script> -->

        <!-- HOT RELOAD BUNDLE -->
        <script src="{{ mix('js/app.js') }}"></script>
        <script src="{{ mix('css/app.css') }}"></script>
    </body>
</html>
