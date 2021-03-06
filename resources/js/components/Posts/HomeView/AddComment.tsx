import React, {useState} from 'react';
import {mutate as global_mutate} from 'swr';
import {useDispatch} from 'react-redux';
import authUser from '../../../state/auth_user';
import {submitUserComment} from '../../../helpers/fetcher';
import showAlert from '../../Alert/showAlert';

/**
 * component for adding comment to
 *  a post
 */

const AddComment: React.FC<{post_id: number, mutate: Function}> = ({post_id, mutate})=>{
    const {user, logged} = authUser();
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const onError = (errs)=>{
        showAlert(dispatch, errs);
        setError(true);
    }

    const onSubmit = ()=>{
        setError(false);
        setLoading(true);
        submitComment(
            {post_id, text, mutate, setText},
            user,
            {setLoading, onError}
        );
    }

    return (
        <React.Fragment>
            <div className='col col-fill'>
                {text=="" && <input role='no-text' className='hidden' />}
                {error && <input role='error' className='hidden' /> }
                <form
                    data-testid="add-comment-form"
                    onSubmit={ev=>{ev.preventDefault(); onSubmit();}}
                >
                    <input
                        type='text'
                        value={text}
                        data-testid="add-comment-input"
                        placeholder='Add a comment...'
                        onChange={_=>setText(_.target.value)}
                    />
                </form>
            </div>
            <div className='col col-1'>
                <button
                    className='post'
                    data-testid="add-comment-btn"
                    disabled={text.trim().length<1 || text.trim().length>290 || isLoading}
                    onClick={onSubmit}
                >
                    Post
                </button>
            </div>
        </React.Fragment>
    );
};



function submitComment({post_id, text, mutate, setText}, user, {setLoading, onError}) {
    if (!text.length) return;

    const username = user?.username || 'anonymous';
    const profile_pic = user?.profile_pic || '/icon/avatar.png';

    mutate(async data => {
        if (!Array.isArray(data) || !data[0]?.message) // must be an array of comments
            return data;
        // add comment to top
        data.unshift({
            username,
            profile_pic,
            message: text,
            likes: 0,
            comment_id: null,
            auth_user_likes: false,
            created_at: new Date(),
        });
        return data;
    });

    submitUserComment(post_id, text)
    .then(res => {
        if (res.success) {
            setText("");
            mutate();
            global_mutate(`${post_id}`);
        } else if (res.errors) {
            mutate(async data => {
                if (!Array.isArray(data) || !data[0]?.message)  // must be an array of comments
                    return data;
                // remove added comment
                data.shift();
                return data;
            });
            onError(res.errors);
        }
    })
    .finally(()=>{
        setLoading(false);
    })
}



export default AddComment;
