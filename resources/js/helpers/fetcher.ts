import axios from 'axios';
import nprogress from '../routes/nprogress';


const handleServerError = (err, onError: (d: Array<string>) => void)=>{
    if (err?.data?.errors instanceof Array) {
        // errors
        onError(err.data.errors);
    } else {
        // other error
        if (typeof err?.data?.message == 'string') {
            onError([err.data.message || "An unknown error occured"])
        } else {
            onError([err.toString()]);
        }
    }
};


///////////////////
// AUTH REQUESTS //
///////////////////

type auth_body = {
    username: string,
    password: string,
    email?: string,
    full_name?: string,
    password_confirmation?: string,
};

/**
 * Used by the Login & Register page
 * @param  {string}                  url      request url
 * @param  {auth_body}               body     request body
 * @param  {Array<string>) => void}  onErr    callback invoked onError
 * @return {Promise<token|null>}                
 */
export async function auth_fetch(url: string, body: auth_body, onErr: (d: Array<string>) => void): Promise<{token:string}|null> {
    nprogress.start();

    let req;
    try {
        req = await axios.post(url, body);

        // not valid response? throw error
        // this is better than axios rejecting the Promise, this way we can show
        // a meaningful error
        // @see `../bootstrap.js`
        //
        if (req.status != 200 || !req.data?.token) {
            throw req;
        }

        // user token
        return {token: req.data.token};

    } catch (err) {
        handleServerError(err, onErr);

        return null;
    } finally {
        nprogress.done();
    }
}
