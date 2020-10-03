import axios from 'axios';
import nprogress from '../routes/nprogress';

import {posts_store} from './util';
import {Post} from '../components/Posts/props.d';

/**
 * Returns meaningful errors? from server error response
 */
const handleServerError = (err, onError: (d: Array<string>) => void): Array<string> =>{
    let ret: Array<string>;
    if (err?.data?.errors instanceof Array) {
        // errors
        ret = err.data.errors;
    } else {
        // other error
        if (typeof err?.data?.message == 'string') {
            ret = [err.data.message || "An unknown error occured"];
        } else {
            if (err.message) {
                ret = [err.message]
            } else {
                ret = [JSON.stringify(err)];
            }
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
 * @param  {Array<string>) => void}  onErr             callback invoked onError
 * @return {Promise<userProfile|boolean>}              logged in or not
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
        return {errors: handleServerError(err, ()=>void 0)};
    }
}


/**
 * fetch post from DB
 * @param {number} post_id post id
 */
export async function fetchPost(post_id: number) {
    let req;
    try {
        req = await axios.get(`/api/post/${post_id}`);

        if (req?.data?.post_url) {
            return req.data;
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
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
            // check if its a post listing, then store them individually in a hash
            // so when a user opens a post, we dont need to individually fetch the 
            // post from the DB using `fetchPost` since each post object in a post listing
            // is same as a single post object in the DB
            const resp = req.data as Post[];
            if (resp.length) {
                const first = resp[0];
                if (
                    typeof first.post_url=='string'
                    && typeof first.media_type=='string'
                ) {
                    // ...
                    posts_store(resp);
                }
            }

            return req.data;
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    }
}


/**
 * fetch authenticated user settings from DB
 */
export async function fetchSettings() {
    let req;
    try {
        req = await axios.get(`/api/user/settings`);

        if (req?.data?.user_id) {
            return req.data;
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    }
}


/**
 * Saves notification settings.
 *
 */
export async function saveSettings(name, value) {
    let req;
    try {
        req = await axios.post(`/api/user/update`, {
            [`notify_${name}`]: Number(value)
        });

        if (req?.data?.message == 'Done') {
            return {success: true};
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    }
}


/**
 * follow user
 */
export async function followUser(user: string) {
    let req;
    try {
        req = await axios.post(`/api/user/${user}/follow`);

        if (req?.data?.message?.includes('Followed')) {
            return {success: true};
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    }
}


/**
 * unfollow user
 */
export async function unfollowUser(user: string) {
    let req;
    try {
        req = await axios.post(`/api/user/${user}/unfollow`);

        if (req?.data?.message?.includes('Unfollowed')) {
            return {success: true};
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    }
}


/**
 * repost users post
 */
export async function repostUserPost(post_id: number) {
    let req;
    try {
        req = await axios.post(`/api/post/${post_id}/repost`);

        if (req?.data?.message?.includes('Success')) {
            return {success: true};
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    }
}

/**
 * delete user post
 */
export async function deletePost(post_id: number) {
    nprogress.start();

    let req;
    try {
        req = await axios.delete(`/api/post/${post_id}`);

        if (req?.data?.message == 'Post deleted') {
            return {success: true};
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    } finally {
        nprogress.done();
    }
}


/**
 * update user password
 *
 * @param      {string}  old_pass  The old password
 * @param      {string}  new_pass  The new password
 */
export async function updatePassword(old_pass: string, new_pass: string) {
    nprogress.start();

    let req;
    try {
        req = await axios.post(`/api/user/password/update`, {
            old_password: old_pass,
            new_password: new_pass,
        });

        if (req?.data?.message == 'Done') {
            return {success: true};
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    } finally {
        nprogress.done();
    }
}


/**
 * update user profile
 *
 * @param      {string}  email
 * @param      {string}  bio
 * @param      {string}  full_name
 * @param      {string}  password
 */
export async function updateProfile(fields: {[index:string]: string}) {
    nprogress.start();

    let req;
    try {
        req = await axios.post(`/api/user/update`, fields);

        if (req?.data?.message == 'Done') {
            return {success: true};
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    } finally {
        nprogress.done();
    }
}


export async function savePost(post_id: number) {
    let req;
    try {
        req = await axios.post(`/api/post/${post_id}/save`);

        if (req?.data?.message == 'Done') {
            return {success: true};
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    }
}


export async function unsavePost(post_id: number) {
    let req;
    try {
        req = await axios.post(`/api/post/${post_id}/unsave`);

        if (req?.data?.message == 'Done') {
            return {success: true};
        }

        throw req;

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    }
}


//////////////////
// Notifications /
//////////////////

/**
 * mark a notification as read (set .new prop to 0)
 * 
 * @param {number} id notification id
 */
export async function markNotification(id: number) {
    axios.post(`/api/user/notification/${id}`);
}

/**
 * deletes a notification from database
 * 
 * @param {number} id notification id
 */
export async function deleteNotification(id: number) {
    axios.delete(`/api/user/notification/${id}`);
}


/////////////////
// User Upload /
////////////////

/**
 * Uploads user DP
 * 
 * @param {React.FormEvent<HTMLInputElement>}                        ev [description]
 * @param {React.Dispatch<React.SetStateAction<boolean>> |  null}    setLoading [description]
 */
export async function uploadUserDP(ev: React.FormEvent<HTMLInputElement>, setLoading: React.Dispatch<React.SetStateAction<boolean>> | null) {
    ev.stopPropagation();
    ev.preventDefault();

    let file = ((ev.target as HTMLInputElement).files as FileList)[0];
    if (!file.size) return;

    if (file.size > 10 * 1024 * 1024) { // > 10MB
        return alert("Image too large (max 10MB)");
    }

    let form = new FormData();
    form.append('image', file);

    // TODO: axios.post('/user/dp', form);

    if (setLoading) {
        setLoading(true);
    }
}


/**
 * Uploads user post.
 *
 * @param      {File}    posts    The posts
 * @param      {string}  caption  The caption
 */
export async function uploadUserPost(posts: File[], caption: string) {
    nprogress.start();

    let form = new FormData();
    posts.forEach(file => {
        form.append('files[]', file);
    });

    let req;
    try {

        return {message: ""};

    } catch (err) {
        return {errors: handleServerError(err, ()=>void 0)};
    } finally {
        nprogress.done();
    }
}

