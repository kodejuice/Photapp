import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {amount} from '../../helpers/util';

import Comments from '../../components/Comments';
import {likePost, savePost, deletePost} from '../../components/Posts/HomeView/helper';


export default function PostInfo({post, auth_user}) {
    const dispatch = useDispatch();
    const {user, logged} = auth_user;

    // post info (authenticated user likes/saved)
    const [postLiked, likesPost] = useState(!!post.auth_user_likes);
    const [postSaved, savesPost] = useState(!!post.auth_user_saved);
    const post_likes = post.auth_user_likes && !postLiked
        ? post.like_count-1
        : (post.auth_user_likes
            ? post.like_count
            : post.like_count + Number(postLiked)
        );
    // ....

    return (
        <div className="card info">

            <div className="card-header">
                <div className='row'>
                    <div className='like-btn'>
                        <button onClick={()=>likePost(post.post_id, ()=>(likesPost(!postLiked), postLiked), post)}>
                            <img src={`/icon/heart${postLiked?'.png':'-blank.svg'}`}/>
                        </button>
                    </div>
                    <div className='col-fill'></div>
                    <div className='save-btn'>
                        <button onClick={()=>savePost(post.post_id, ()=>(savesPost(!postSaved), postSaved), post)}>
                            <img src={`/icon/bookmark${postSaved?'.png':'-blank.svg'}`} />
                        </button>
                    </div>
                </div>
                <div className='row act'>
                    <div className='col-likes'>
                        <p id='likes-count'> {amount(post_likes)} likes </p>
                    </div>
                </div>
            </div>

           <div className="card-post comment-card">
               <div className='comments'>
                   <Comments post={post} post_id={post.post_id} />
               </div>
           </div>

        </div>
    );
}
