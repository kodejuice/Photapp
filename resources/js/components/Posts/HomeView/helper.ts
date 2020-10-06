import {mutate} from 'swr';
import showAlert from '../../Alert/showAlert';
import {copyText} from '../../../helpers/window';
import {
    deletePost as deleteUserPost,
    savePost as saveUserPost,
    unsavePost,
    likePost as likeUserPost,
    unlikePost,
} from '../../../helpers/fetcher';

/**
 * helper functions for the components displaying a list of posts
 */


/**
 * copy text to clipboard
 * @param  {string} text           text to copy
 * @param  {Function} dispatch     redux dipatch hook
 */
export function copyToClipboard(text, dispatch) {
    copyText(text, (copied)=>{
        if (copied) {
            showAlert(dispatch, ['Copied to clipboard'], 'success');
        } else {
            showAlert(dispatch, ['Failed to copy, please switch to a modern browser']);
        }
    });
}



/**
 * deletes a post
 * @param  {number} post_id
 */
export async function deletePost(post_id: number) {
    if (!confirm("Delete this post?")) return;

    return deleteUserPost(post_id)
    .then(res=>{
        if (res.errors) {
            console.error(res.errors);
            return alert(`An error occured, try again\n\n${res.errors[0]}`);
        } else if (res.success) {
            (window as any).location = "/";
            return true;
        }
    })
    .catch(()=>{});
}


/**
 * likes a post
 * @param  {number} post_id
 * @param  {Fn} toggleLike: ()   toggle like state
 * @param  {object} post : post beign liked
 */
export async function likePost(post_id: number, toggleLike: ()=>boolean, post: any) {
    const like = !toggleLike();

    const revalidateSWR = ()=>{
        mutate(`${post_id}`);
    }

    const promise = like ? likeUserPost(post_id) : unlikePost(post_id);
    return promise
    .then(res=>{
        if (res.success) {
            revalidateSWR();
            return true;
        } else {
            toggleLike();
            console.error(res.errors);
            return false;
        }
    })
    .catch(()=>{});
}


/**
 * bookmarks a post
 * @param  {number} post_id
 * @param  {Fn} toggleSave: ()   toggle save state and return previous state value
 * @param  {object} post : post beign saved
 */
export async function savePost(post_id: number, toggleSave: ()=>boolean, post: any) {
    const save = !toggleSave();

    const revalidateSWR = ()=>{
        mutate(`${post_id}`);
    }

    const promise = save ? saveUserPost(post_id) : unsavePost(post_id);
    return promise
    .then(res=>{
        if (res.errors) {
            if (res.errors[0].includes('Already')) return;
            toggleSave();
            console.error(res.errors);
            return alert(`Failed to save post\n\n${res.errors[0]}`);
        } else if (res.success) {
            post.auth_user_saved = save;
            revalidateSWR();
            return true;
        }
    })
    .catch(()=>{});
}

