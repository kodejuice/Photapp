import React, {useState} from 'react';
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

    const onError = (errs)=>{
        showAlert(dispatch, errs);
    }

    const onSubmit = ()=>{
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
                <form onSubmit={ev=>{ev.preventDefault(); onSubmit();}}>
                    <input type='text' value={text} placeholder='Add a comment...' onChange={_=>setText(_.target.value)}/>
                </form>
            </div>
            <div className='col col-1'>
                <button
                    className='post'
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

    mutate(async comments => {
        if (!Array.isArray(comments)) return;
        // add comment to top
        comments.unshift({
            username,
            profile_pic,
            message: text,
            likes: 0,
            comment_id: null,
            auth_user_likes: false,
            created_at: new Date(),
        });
        return comments;
    });

    submitUserComment(post_id, text)
    .then(res => {
        if (res.success) {
            setText("");
            mutate();
        } else if (res.errors) {
            mutate(async comments => {
                if (!Array.isArray(comments)) return;
                // remove added comment
                comments.shift();
                return comments;
            });
            onError(res.errors);
        }
    })
    .finally(()=>{
        setLoading(false);
    })
}



export default AddComment;
