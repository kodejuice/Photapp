# TTD before production

- php artisan config:cache
- use secret key (config.APP_KEY)
- http://localhost/laravel/laravel.com/docs/7.x/deployment.html
- php artisan route:cache and php artisan route:clear
- php artisan view:cache and php artisan view:clear


# Build steps (on server)
+ create db (photapp, photoapp-testing)

[$ ./setup]
    + php artisan migrate
    + php artisan passport:install
    + npm run prod

