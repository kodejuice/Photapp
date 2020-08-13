<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="{{ asset("css/app.css") }}">

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
