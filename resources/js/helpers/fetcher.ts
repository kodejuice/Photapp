import axios from 'axios';
import nprogress from '../routes/nprogress';


const handleServerError = (err, onError: (d: Array<string>) => void)=>{
    let ret: Array<string>;
    if (err?.data?.errors instanceof Array) {
        // errors
        ret = err.data.errors;
    } else {
        // other error
        if (typeof err?.data?.message == 'string') {
            ret = [err.data.message || "An unknown error occured"];
        } else {
            ret = [err.toString()];
        }
    }

    onError(ret);

    return ret;
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

type userProfile = {
    id: number,
    email: string,
    username: string,

    full_name: string,
    profile_pic: string,

    follows: number,
    followers: number,
    posts_count: number,
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


/**
 * checks user Login Status from server
 * @param  {Array<string>) => void}  onErr    callback invoked onError
 * @return {Promise<{}|boolean>}              logged in or not
 */
export async function checkLoginStatus(onErr): Promise<userProfile|boolean> {
    nprogress.start();

    let req;
    try {
        req = await axios.get('/api/user/profile');

        if (req?.data?.message?.includes("Unauthenticated")) {
            return false;
        }

        if (typeof req?.data?.username == 'string') {
            return req.data;
        }

        throw req;

    } catch (err) {
        handleServerError(err, onErr);

        return false;
    } finally {
        nprogress.done();
    }
}


 /**
  * logs user out
  * @param  (void)=>void           onLogOut  callback fn called on-logout
  * @param  (void)=>void           onError   callback fn called on-error
  * @return {Promise<boolean>}               logged out or not
  */
export async function logUserOut(onLogOut, onErr): Promise<boolean> {
    nprogress.start();

    let req;
    try {
        req = await axios.post('/api/logout');

        if (req?.data?.message?.includes("successfully")) {
            onLogOut();
            return true;
        }

        throw req;

    } catch (err) {
        handleServerError(err, onErr);

        return false;
    } finally {
        nprogress.done();
    }
}


//////////////////////////
// User Accout Requests //
//////////////////////////


/**
 * fetch user profile from DB
 * @param {string} user username
 */
export async function fetchUser(user: string) {
    let req;
    try {
        req = await axios.get(`/api/user/getprofile?username=${user}`);

        if (req?.data?.username) {
            return req.data;
        }

        throw req;

    } catch (err) {
        return {};
    }
}


/**
 * fetch list of {X} from DB, e.g notifications, followers, e.t.c...
 * @param {string} url     API url
 */
export async function fetchListing(url) {
    let req;
    try {
        req = await axios.get(url);

        if (req?.data instanceof Array) {
            return req.data;
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    }
}
