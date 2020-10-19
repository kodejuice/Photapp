/**
 * convert minutes to milliseconds
 */
const minutes_to_ms = (minute) => minute * 60 * 1000;


/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';
import Cookie from 'js-cookie';

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    forceTLS: true,
    auth: {
        headers: {
            Authorization: 'Bearer ' + Cookie.get('AUTH_TOKEN')
        },
    },
});

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.axios.defaults.timeout = minutes_to_ms(45) /*45 minutes*/;



// our API returns response of status >=400 for invalid inputs
// but we dont want to reject those response, instead we should resolve them
// and show the user the generated error message
window.axios.defaults.validateStatus = (status) => status >= 200;


// i am very sure that this is treason
// forgive me my lord :(
const originalError = console.error
console.error = (...args) => {
    if (/Warning.*Cannot update a component/.test(args[0])) return
    originalError.call(console, ...args)
}


//////////////////////
// Global App store //
//////////////////////

const LRU = require('lru-cache');


/**
 * get length of object
 */
const object_len = (obj) => JSON.stringify(obj).length;


window.Store = {

    // will store base64 string of uploaded files
    'uploaded_file_url': new LRU({
        max: 10485760, // 10MB (bytes)
        length: (item, k) => item.length,
        maxAge: minutes_to_ms(10),
    }),

    // wiil be used to store fetched data in SWR
    // @see ./helpers/swr.ts
    'swr_map': new LRU({
        max: 5242880, // 5MB (bytes)
        length: (item, k) => object_len(item),
        maxAge: minutes_to_ms(60),
        updateAgeOnGet: true,
    }),

    // will store memoized values
    'memoizer': new LRU({
        max: 2097152, // 2MB
        length: (item, k) => item.length + k.length,
        maxAge: minutes_to_ms(30),
    }),

    // will store fetched posts
    'posts': new LRU({
        max: 5242880, // 5MB
        length: (item, k) => object_len(item),
        maxAge: minutes_to_ms(60),
        updateAgeOnGet: true,
    }),

    // will store base64 string of video thumbnail images
    'grid_thumnails': new LRU({
        max: 20971520, // 20MB
        length: (item, k) => item.length,
        maxAge: minutes_to_ms(20),
        updateAgeOnGet: true,
    }),

};

