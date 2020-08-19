import axios from 'axios';
import nprogress from '../routes/nprogress';


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

export async function auth_fetch(url: string, body: auth_body, onErr: (d: Array<string>) => void): Promise<string|null> {
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

        return req.data.token;

    } catch (err) {
        if (err?.data?.errors instanceof Array) {
            // errors
            onErr(err.data.errors);
        } else {
            // other error
            if (typeof err?.data?.message == 'string') {
                onErr([err.data.message || "An unknown error occured"])
            } else {
                onErr([err.toString()]);
            }
        }

        return null;
    } finally {
        nprogress.done();
    }
}
