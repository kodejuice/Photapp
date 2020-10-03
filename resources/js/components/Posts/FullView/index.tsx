import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useDoubleTap} from 'use-double-tap';

import LazyDP from '../../../components/LazyDP';
import FollowButton from '../../../components/FollowButton';
import {ProcessUserInput} from '../../../helpers/mini-components';

import {Post} from '../props.d';
import showAlert from '../../Alert/showAlert';
import {limit, amount} from '../../../helpers/util';
import authUser from '../../../state/auth_user';

import MediaViewer from '../HomeView/MediaViewer';
import {likePost, savePost} from '../HomeView/helper';

import "./style.scss";

type HomePost = {
    data: Post[],
}

const heartIcon_blank = <svg viewBox="0 0 50 50"><path fill="#fafafa" stroke="#fafafa" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M35,8c-4.176,0-7.851,2.136-10,5.373C22.851,10.136,19.176,8,15,8C8.373,8,3,13.373,3,20c0,14,16,21,22,26c6-5,22-12,22-26C47,13.373,41.627,8,35,8z"/></svg>;
const bookmarkIcon_blank = <svg viewBox="0 0 50 50"><path fill="#fafafa" stroke="#fafafa" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M37 3L13 3 13 47 25 40 37 47z"/></svg>;

const commentIcon = <svg viewBox="0 0 64 64" width="64px" height="64px"><path fill="#f9e3ae" d="M1,29.88C1,43.54,14.91,54.66,32,54.66a38.7,38.7,0,0,0,6.41-.54c1.24,2,4.68,6.13,12,7.76l.21,0a1,1,0,0,0,.83-1.47,22.19,22.19,0,0,1-2.91-9.61C57.62,46.27,63,38.47,63,29.88,63,16.21,49.09,5.09,32,5.09S1,16.21,1,29.88Z"/><path fill="#f6d397" d="M62.36,34.95c-1.67,6.53-6.56,12.24-13.8,15.89a22.2,22.2,0,0,0,2.91,9.61,1,1,0,0,1-.83,1.47l-.21,0c-7.33-1.63-10.77-5.81-12-7.76a38.7,38.7,0,0,1-6.41.54C17.11,54.66,4.64,46.22,1.67,35a4,4,0,0,1,3.88-5H58.46A4,4,0,0,1,62.36,34.95Z"/><path fill="#85cbf8" d="M32 11A24 19 0 1 0 32 49A24 19 0 1 0 32 11Z"/><path fill="#8d6c9f" d="M64,29.76C64,15.65,49.64,4.17,32,4.17S0,15.65,0,29.76,14.36,55.34,32,55.34a40,40,0,0,0,6.62-.55c1.28,2,4.83,6.33,12.4,8l.22,0a1,1,0,0,0,.86-1.51,22.91,22.91,0,0,1-3-9.92C58.44,46.68,64,38.63,64,29.76ZM47.62,49.89a1,1,0,0,0-.57.95,26,26,0,0,0,2.23,9.42c-6.09-2-8.61-5.83-9.28-7.05a1,1,0,0,0-.88-.52l-.18,0a38,38,0,0,1-6.94.64c-16.54,0-30-10.58-30-23.59S15.46,6.17,32,6.17,62,16.75,62,29.76C62,38,56.63,45.56,47.62,49.89Z"/><path fill="#faefde" d="M20 28A2 2 0 1 0 20 32 2 2 0 1 0 20 28zM32 28A2 2 0 1 0 32 32 2 2 0 1 0 32 28zM44 28A2 2 0 1 0 44 32 2 2 0 1 0 44 28z"/><path fill="#8d6c9f" d="M31.71 45.69a1 1 0 0 0-.91 1.08l.17 2a1 1 0 0 0 1 .91h.09A1 1 0 0 0 33 48.59l-.17-2A1 1 0 0 0 31.71 45.69zM12.2 37l-1.64 1.15a1 1 0 1 0 1.14 1.64l1.64-1.15A1 1 0 0 0 12.2 37zM15.71 41.2l-1.29 1.53A1 1 0 0 0 15.95 44l1.29-1.53a1 1 0 1 0-1.53-1.29zM21.52 43.88a1 1 0 0 0-1.33.48l-.85 1.81a1 1 0 0 0 1.81.85L22 45.21A1 1 0 0 0 21.52 43.88zM26.49 45.46a1 1 0 0 0-1.16.81l-.35 2a1 1 0 0 0 .81 1.16l.18 0a1 1 0 0 0 1-.83l.35-2A1 1 0 0 0 26.49 45.46zM9 30c0-9.92 10.3-18 23-18a27.89 27.89 0 0 1 11.55 2.45 1 1 0 0 0 .83-1.82A29.91 29.91 0 0 0 32 10C18.24 10 7 19 7 30a16.31 16.31 0 0 0 .5 4 1 1 0 0 0 1 .75 1 1 0 0 0 .25 0 1 1 0 0 0 .72-1.21A14.29 14.29 0 0 1 9 30zM54.47 21.29a1 1 0 1 0-1.71 1A14.69 14.69 0 0 1 55 30c0 8.19-7.06 15.36-17.17 17.42a1 1 0 0 0 .2 2l.2 0C49.24 47.13 57 39.16 57 30A16.66 16.66 0 0 0 54.47 21.29zM50.1 18.94a1 1 0 1 0 1.42-1.41A22.82 22.82 0 0 0 48.8 15.2a1 1 0 0 0-1.18 1.62A21 21 0 0 1 50.1 18.94z"/></svg>;
const bookmarkIcon = <img src="/icon/bookmark.png" />;
const heartIcon = <img src="/icon/heart.png" />;



/**
 * single post component
 * @param  {Post} options.post single post object
 * @param  {number} options.idx  post index
 */
const SinglePost: React.FC<{post: Post, idx: number}> = ({post, idx}) => {
    const {logged, user} = authUser();
    const [heartShown, showHeart] = useState(false);

    // post info (authenticated user likes/saved/follow)
    const [postLiked, likesPost] = useState(!!post.auth_user_likes);
    const [postSaved, savesPost] = useState(!!post.auth_user_saved);
    const post_likes = post.auth_user_likes && !postLiked
        ? post.like_count-1
        : (post.auth_user_likes
            ? post.like_count
            : post.like_count + Number(postLiked)
        );
    const shouldFollow = logged && post.username != user?.username && !post.auth_user_follows;
    // ....

    // doubletap event handler
    const ondoubletap = useDoubleTap((event) => {
        likePost(post.post_id, ()=>{
            likesPost(!postLiked);
            return postLiked;
        }, post);

        showHeart(true);
        setTimeout(()=>showHeart(false), 790);
    });

    return (
        <div role="post" className="card-full" key={post.post_id}>
            <div style={{display: 'none'}}>
                <img src="/icon/bookmark.png" />
                <img src="/icon/heart.png" />
            </div>

            <div className="card-post" role='full-view-card'>
                <div {...ondoubletap}>
                    {heartShown && <div className="doubletap-icon"> {heartIcon_blank} </div>}
                    <MediaViewer
                        paths={JSON.parse(post.post_url)}
                        media_types={JSON.parse(post.media_type)}
                    />
                </div>

                <div className='post-info'>
                    <div className='author-dp'>
                        <LazyDP user={post.username} />
                        <div className='follow-user' title={`Follow @${post.username}`}>
                            { shouldFollow && <FollowButton child={<div>+</div>} user={post.username} />}
                        </div>
                    </div>
                    <div role='like-post-btn' className='like-count _row' onClick={()=>likePost(post.post_id, ()=>(likesPost(!postLiked), postLiked), post)}>
                        <div className='icon'> {postLiked ? heartIcon: heartIcon_blank} </div>
                        <div className='count' role='post-likes'> {amount(post_likes)} </div>
                    </div>
                    <div className='comment-count _row'>
                        <Link to={`/post/${post.post_id}#comments`}>
                            <div className='icon'> {commentIcon} </div>
                            <div className='count'> {amount(post.comment_count)} </div>
                        </Link>
                    </div>
                    {logged && (
                        <div className='save-post _row' title="Save this post"
                            onClick={()=>{
                                const callback = ()=>{
                                    savesPost(!postSaved)
                                    return postSaved;
                                }
                                savePost(post.post_id, callback, post);
                            }}>
                            <div className='icon'> {postSaved ? bookmarkIcon: bookmarkIcon_blank} </div>
                        </div>
                    )}
                </div>

                <div className='post-caption'>
                    <div className='username'> <Link to={`/user/${post.username}`}>@{post.username}</Link> </div>
                    {post.caption && <p> <ProcessUserInput text={limit(post.caption||"", 100)} /> </p>}
                </div>
            </div>

        </div>                
    );
}

const HomePosts: React.FC<HomePost> = ({data})=>{
    return (
        <React.Fragment>
            {data.map((post,i) => <SinglePost key={post.post_url} idx={i} post={post}/>)}
        </React.Fragment>
    );
}

export default HomePosts;
