import showAlert from '../../Alert/showAlert';
import {copyText} from '../../../helpers/window';
import {deletePost as deleteUserPost, savePost as saveUserPost, unsavePost} from '../../../helpers/fetcher';

/**
 * helper functions for the post HomeView post component
 */


export function submitComment(post_id: number, commentText: string) {
    if (!commentText.length) return;
    // TODO: submit comment

    alert(commentText);
}


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
export function deletePost(post_id: number) {
    if (!confirm("Delete this post?")) return;

    deleteUserPost(post_id)
    .then(res=>{
        if (res.errors) {
            console.error(res.errors);
            return alert(`An error occured, try again\n\n${res.errors[0]}`);
        } else if (res.success) {
            (window as any).location = "/";
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
export function likePost(post_id: number, toggleLike: ()=>boolean, post: any) {
    const like = !toggleLike();

    // TODO: perform action
}


/**
 * bookmarks a post
 * @param  {number} post_id
 * @param  {Fn} toggleSave: ()   toggle save state and return previous state value
 * @param  {object} post : post beign saved
 */
export function savePost(post_id: number, toggleSave: ()=>boolean, post: any) {
    const save = !toggleSave();

    const promise = save ? saveUserPost(post_id) : unsavePost(post_id);
    promise
    .then(res=>{
        if (res.errors) {
            if (res.errors[0].includes('Already')) {
                post.auth_user_saved = save;
                return;
            }
            toggleSave();
            console.error(res.errors);
            return alert(`Failed to save post\n\n${res.errors[0]}`);
        } else if (res.success) {
            post.auth_user_saved = save;
        }
    })
    .catch(()=>{});
}

