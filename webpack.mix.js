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
        ////////////////////
        // service worker //
        ////////////////////
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
                  handler: 'cacheFirst',
              },
              {
                  urlPattern: /^https:\/\/drive\.google\.com\/uc\?id\=/,
                  handler: 'cacheFirst',
                  options: {
                      cache: {
                          name: 'media_files',
                          maxEntries: 200,
                          maxAgeSeconds: weeks_to_seconds(1),
                      },
                  }
              },
              {
                urlPattern: /\/api\/dl/,
                handler: 'cacheFirst',
                options: {
                    cache: {
                        name: 'videos_files',
                        maxEntries: 200,
                        maxAgeSeconds: weeks_to_seconds(1),
                    },
                }
              },
              {
                urlPattern: /\/api\/user\/profile/,
                handler: 'networkFirst',
                options: {
                    cache: {
                        name: 'auth_user',
                        maxEntries: 1,
                        maxAgeSeconds: weeks_to_seconds(4),
                    },
                }
              },

              ////////////////
              // API routes //
              ////////////////
              {
                urlPattern: /\/api\/(posts|users)/,
                handler: 'fastest',
                options: {
                    cache: {
                        name: 'user_data_list',
                        maxEntries: 100,
                        maxAgeSeconds: weeks_to_seconds(2),
                    },
                }
              },
              {
                urlPattern: /\/api\/post\/([0-9]+)/,
                handler: 'fastest',
                options: {
                    cache: {
                        name: 'user_post',
                        maxEntries: 200,
                        maxAgeSeconds: weeks_to_seconds(1),
                    },
                }
              },
              {
                urlPattern: /\/api\/user\/getprofile/,
                handler: 'fastest',
                options: {
                    cache: {
                        name: 'user_profiles',
                        maxEntries: 100,
                        maxAgeSeconds: weeks_to_seconds(1),
                    },
                }
              },
              {
                urlPattern: /\/api\/user\/(\w+)\/(posts|followers|following|bookmarks|mentions)/,
                handler: 'fastest',
                options: {
                    cache: {
                        name: 'user_data',
                        maxEntries: 100,
                        maxAgeSeconds: weeks_to_seconds(1),
                    },
                }
              },
              {
                urlPattern: /\/api\/post\/([0-9]+)\/comments/,
                handler: 'fastest',
                options: {
                    cache: {
                        name: 'post_comments',
                        maxEntries: 30,
                        maxAgeSeconds: days_to_seconds(3),
                    },
                }
              },
            ],
        })
      ],
      resolve: {
        extensions: ["*", ".js", ".jsx", ".vue", ".ts", ".tsx"]
      },
  });




////////////
// Helper //
////////////

function days_to_seconds(days) {
    return days * 24 * 60 * 60;
}

function weeks_to_seconds(weeks) {
    return days_to_seconds(weeks * 7);
}
