const mix = require('laravel-mix');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
    .react('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .webpackConfig({
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/
          }
        ]
      },
      plugins: [
        new SWPrecacheWebpackPlugin({
            cacheId: 'pwa',
            filename: 'service-worker.js',
            staticFileGlobs: ['public/**/*.{css,eot,svg,png,ttf,woff,woff2,js,html}'],
            minify: true,
            stripPrefix: 'public/',
            handleFetch: true,
            dynamicUrlToDependencies: {
              '/': ['resources/views/app.blade.php'],
            },
            staticFileGlobsIgnorePatterns: [/\.map$/, /mix-manifest\.json$/, /manifest\.json$/, /service-worker\.js$/],
            navigateFallback: '/',
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
                handler: 'cacheFirst'
              },
              {
                urlPattern: /^https:\/\/drive\.google\.com\/uc\?id\=/,
                handler: 'cacheFirst'
              },

              ////////////////
              // API routes //
              ////////////////
              {
                urlPattern: /\/api\/user\/(\w+)\/(posts|followers|following|bookmarks|mentions)/,
                handler: 'cacheFirst'
              },
              {
                urlPattern: /\/api\/user\/(getprofile|bookmarks|notifications|settings|posts|profile)/,
                handler: 'cacheFirst'
              },
              {
                urlPattern: /\/api\/post\/([0-9]+)/,
                handler: 'cacheFirst'
              },
              {
                urlPattern: /\/api\/post\/([0-9]+)\/comments/,
                handler: 'cacheFirst'
              },
              {
                urlPattern: /\/api\/posts/,
                handler: 'cacheFirst'
              },
              {
                urlPattern: /\/api\/users/,
                handler: 'cacheFirst'
              },
            ],
        })
      ],
      resolve: {
        extensions: ["*", ".js", ".jsx", ".vue", ".ts", ".tsx"]
      },
  });
