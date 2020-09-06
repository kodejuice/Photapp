window._ = require('lodash');

try {
    //window.Popper = require('popper.js').default;
    //window.$ = window.jQuery = require('jquery');
    // require('bootstrap');
} catch (e) {}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


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


/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// window.Pusher = require('pusher-js');

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     cluster: process.env.MIX_PUSHER_APP_CLUSTER,
//     forceTLS: true
// });
