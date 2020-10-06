import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {useDoubleTap} from 'use-double-tap';

import {Post} from '../props.d';
import LazyDP from '../../LazyDP';
import FollowButton from '../../FollowButton';
import RepostButton from '../../RepostButton';
import {ProcessUserInput} from '../../../helpers/mini-components';
import {limit, amount} from '../../../helpers/util';
import authUser from '../../../state/auth_user';

import {usePost} from '../../../pages/Post';
import AddComment from './AddComment';
import MediaViewer from './MediaViewer';
import {likePost, copyToClipboard, deletePost, savePost} from './helper';

import './style.scss';

type HomePost = {
    data: Post[],
}

const heartIcon = <svg viewBox="0 0 50 50"><path fill="#fafafa" stroke="#fafafa" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M35,8c-4.176,0-7.851,2.136-10,5.373C22.851,10.136,19.176,8,15,8C8.373,8,3,13.373,3,20c0,14,16,21,22,26c6-5,22-12,22-26C47,13.373,41.627,8,35,8z"/></svg>;


/**
 * single post component
 * @param  {Post} options.post single post object
 * @param  {number} options.idx  post index
 */
const SinglePost: React.FC<{post: Post, idx: number}> = ({post, idx}) => {
    const {logged, user} = authUser();
    const dispatch = useDispatch();

    // fetch this post from server, though we already have it,
    // we need a mutate function so we can apply individual changes to a single post
    const {post: data, mutate} = usePost(post.post_id);
    if (data && data.post_url && data.media_type) {
        post = data;
    }


    const [heartShown, showHeart] = useState(false);
    const i = idx, caption_limit = 140;

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

    // post caption info
    const caption: string = post.caption || "";
    const [postCaption, setPostCaption] = useState(limit(caption, caption_limit));
    const [fullCommentShown, showFullComment] = useState(caption == postCaption);
    const showComment = (t)=>{
        if (t == 'more') {
            setPostCaption(caption);
        } else if (t == 'less') {
            setPostCaption(limit(caption, caption_limit));
        }
        showFullComment(t == 'more' ? true : false);
    };
    // ...

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
        <div role="post" className="card">
            <div style={{display: 'none'}}>
                <img src="/icon/heart.png" />
                <img src="/icon/heart-blank.svg" />
                <img src="/icon/bookmark.png" />
                <img src="/icon/bookmark-blank.svg" />
                <img src="/icon/comment.svg" />
            </div>

            {/* <Post modal> */}
            <input className="modal-state" id={`modal-${i+1}`} type="checkbox"/>
            <div className="modal">
                <label className="modal-bg" htmlFor={`modal-${i+1}`}></label>
                <div className="modal-body">
                    {logged && (post.username != user.username
                        ? <FollowButton user={post.username} unfollow={post.auth_user_follows} />
                        : <button onClick={()=>deletePost(post.post_id)} className='delete-post'> Delete post </button>
                    )}
                    <button> <Link to={`/post/${post.post_id}`}>Go to Post</Link> </button>
                    {logged && user?.username != post.username && <RepostButton username={post.username} post_id={+post.post_id} />}
                    <button onClick={()=>copyToClipboard(`${location.host}/post/${post.post_id}`, dispatch)}> Copy link </button>
                    <label className='cancel' htmlFor={`modal-${i+1}`}> Cancel </label>
                </div>
            </div>
            {/* </Post modal> */}

            <div className="card-header">
                <div className='row post-info'>
                    <div className='col col-1'> <div className='user-dp'> <Link to={`/user/${post.username}`}> <LazyDP user={post.username} /> </Link>  </div> </div>
                    <div className='col col-fill'> <div className='user-name'> <Link to={`/user/${post.username}`}> {post.username} </Link> </div> </div>
                    <label htmlFor={`modal-${i+1}`}> <div className='col col-1'> <div className='user-opt'> <svg aria-label="More options" fill="#262626" height="16" viewBox="0 0 48 48" width="16"><circle clipRule="evenodd" cx="8" cy="24" fillRule="evenodd" r="4.5"></circle><circle clipRule="evenodd" cx="24" cy="24" fillRule="evenodd" r="4.5"></circle><circle clipRule="evenodd" cx="40" cy="24" fillRule="evenodd" r="4.5"></circle></svg> </div> </div> </label>
                </div>
            </div>

            <div className="card-post">
                <div {...ondoubletap}>
                    {heartShown && <div className="doubletap-icon"> {heartIcon} </div>}
                    <MediaViewer
                        paths={JSON.parse(post.post_url)}
                        media_types={JSON.parse(post.media_type)}
                    />
                </div>
            </div>

            <div className="card-body">
                <div className='post-action row'>
                    <div className='col col-3'>
                        <div className='row btns'>
                            <div className='col col-5'>
                                {/*like button*/}
                                <button role='like-post-btn-H' onClick={()=>likePost(post.post_id, ()=>(likesPost(!postLiked), postLiked), post)}>
                                    <img src={`/icon/heart${postLiked?'.png':'-blank.svg'}`}/>
                                </button>
                            </div>
                            <div className='col col-6'>
                                {/*comment button*/}
                                <button> <Link to={`/post/${post.post_id}#comments`}> <img src={`/icon/comment.svg`} /> </Link> </button>
                            </div>
                        </div>
                    </div>
                    <div className='col col-fill'></div>
                    <div className='col col-1'>
                       <button
                            onClick={()=>{
                                const callback = ()=>{
                                    savesPost(!postSaved)
                                    return postSaved;
                                }
                                savePost(post.post_id, callback, post);
                            }}>
                            <img src={`/icon/bookmark${postSaved?'.png':'-blank.svg'}`} />
                        </button>
                    </div>
                </div>
                {post_likes>0 && <div className='likes' role='post-likes-H'>{amount(post_likes)} likes</div>}
                <div className='post-comments'>
                    {post.caption?
                        <div className='comment'>
                            <span className='user'> <Link to={`/user/${post.username}`}>{post.username}</Link> </span>
                            <span className='msg'>
                                <span> <ProcessUserInput text={postCaption} /> </span>
                                <span>{
                                    fullCommentShown
                                    ? (caption.length > caption_limit ? <a onClick={()=>showComment('less')}> (less) </a> : "")
                                    : <a onClick={()=>showComment('more')}> (more) </a>
                                }</span>
                            </span>
                        </div>
                    : "" }

                    {post.comment_count?
                        <div className='more'>
                            <Link to={`/post/${post.post_id}#comments`}>View all {amount(post.comment_count)} comment{post.comment_count>1?'s':''}</Link>
                        </div>
                    : ""}

                    {logged && post.auth_user_comment?
                        <div className='comment auth-user-comment'>
                            <div> ... </div>
                            <span className='user'> <Link to={`/user/${user.username}`}> {user.username} </Link> </span>
                            <span className='msg'> <ProcessUserInput text={limit(post.auth_user_comment, 59)} /> </span>
                        </div>
                    : ""}
                </div>

                <div className='add-comment row hide-comment-mobile'>
                    <AddComment mutate={()=>mutate()} post_id={post.post_id} />
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
