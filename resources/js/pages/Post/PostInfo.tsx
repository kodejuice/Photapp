import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {amount} from '../../helpers/util';

import Comments from '../../components/Comments';
import {likePost, savePost, deletePost} from '../../components/Posts/HomeView/helper';

const bookmarkIcon = <img src="/icon/bookmark.png" />;
const bookmarkIcon_blank = <svg fill="#000000" viewBox="0 0 50 50"><path fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M37 3L13 3 13 47 25 40 37 47z"/></svg>;


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
        <div className="card info" role='post-info-card'>

            <div className="card-header">
                <div className='row'>
                    <div className='like-btn'>
                        <button data-testid="like-btn" onClick={()=>likePost(post.post_id, ()=>(likesPost(!postLiked), postLiked), post)}>
                            <img src={`/icon/heart${postLiked?'.png':'-blank.svg'}`}/>
                        </button>
                    </div>
                    <div className='col-fill'></div>
                    {logged && <div className='save-btn'>
                        <button
                            onClick={()=>{
                                const callback = ()=>{
                                    savesPost(!postSaved)
                                    return postSaved;
                                }
                                savePost(post.post_id, callback, post);
                            }}>
                            {postSaved ? bookmarkIcon: bookmarkIcon_blank}
                        </button>
                    </div>}
                </div>
                <div className='row act'>
                    <div className='col-likes'>
                        <p id='likes-count' data-testid='likes-count'> {amount(post_likes)} likes </p>
                    </div>
                </div>
            </div>

            <div className="card-post comment-card">
                <Comments post={post} post_id={post.post_id} />
            </div>

        </div>
    );
}
