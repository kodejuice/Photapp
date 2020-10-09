import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useDoubleTap} from 'use-double-tap';

import LazyDP from '../../../components/LazyDP';
import FollowButton from '../../../components/FollowButton';
import {ProcessUserInput, heartIcon_blank_svg as heartIcon_blank, bookmarkIcon_blank, commentIcon, heartIcon} from '../../../helpers/mini-components';

import {Post} from '../props.d';
import showAlert from '../../Alert/showAlert';
import {limit, amount} from '../../../helpers/util';
import authUser from '../../../state/auth_user';

import {usePost} from '../../../pages/Post';
import MediaViewer from '../HomeView/MediaViewer';
import {likePost, savePost} from '../HomeView/helper';

import "./style.scss";

type HomePost = {
    data: Post[],
}

const bookmarkIcon = <img src="/icon/bookmark.png" />;


/**
 * single post component
 * @param  {Post} options.post single post object
 * @param  {number} options.idx  post index
 */
const SinglePost: React.FC<{post: Post, idx: number}> = ({post, idx}) => {
    const {logged, user} = authUser();
    const [heartShown, showHeart] = useState(false);

    // fetch this post from server, though we already have it,
    // we need a mutate function so we can apply individual changes to a single post
    const {post: data, mutate} = usePost(post.post_id);
    if (data && data.post_url && data.media_type) {
        post = data;
    }

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
                        <Link to={`/user/${post.username}`}>
                            <LazyDP user={post.username} />
                        </Link>
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
            {data.map((post,i) => (
                <SinglePost
                    idx={i}
                    post={post}
                    key={post.username + post.post_url + post.created_at}
                />
            ))}
        </React.Fragment>
    );
}

export default HomePosts;
