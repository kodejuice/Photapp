import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import authUser from '../../../state/auth_user';

import {Post} from '../types.d';
import LazyDP from '../../LazyDP';
import FollowButton from '../../FollowButton';

import {limit} from '../../../helpers/util';

import './style.scss';

type HomePost = {
    data: Post[],
}

// TODO: get icons
// TODO: auth_user_likes?
// TODO: auth_user_saved?

// TODO: copy link
// TODO: media viewer
// TODO: infinite scroll



/**
 * single post component
 * @param  {Post} options.post single post object
 * @param  {number} options.idx  post index
 */
const SinglePost: React.FC<{post: Post, idx: number}> = ({post, idx}) => {
    const {logged, user} = authUser();
    const caption: string = post.caption || "";
    const i = idx, caption_limit = 100;

    const [commentText, setCommentText] = useState("");

    const [postComment, setPostComment] = useState(limit(caption, caption_limit));
    const [isFullComment, setFullComment] = useState(caption == postComment);

    const show = (t)=>{
        if (t == 'more') {
            setPostComment(caption);
        } else if (t == 'less') {
            setPostComment(limit(caption, caption_limit));
        }
        setFullComment(t == 'more' ? true : false);
    };

    return (
        <div className="card" key={post.post_id}>

            {/* <Post modal> */}
            <input className="modal-state" id={`modal-${i+1}`} type="checkbox"/>
            <div className="modal">
                <label className="modal-bg" htmlFor={`modal-${i+1}`}></label>
                <div className="modal-body">
                    {post.username != user.username
                        ? <FollowButton user={post.username} unfollow={post.auth_user_follows} />
                        : <button className='delete-post'> Delete post </button>
                    }
                    <button> <Link to={`/post/${post.post_id}`}>Go to Post</Link> </button>
                    <button> Copy link </button>
                    <label htmlFor={`modal-${i+1}`}> Cancel </label>
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
                <img src="/test/1.png" alt="Card example image"/>
            </div>

            <div className="card-body">
                <div className='post-action row'>
                    <div className='col col-3'>
                        <div className='row btns'>
                            <div className='col col-5'> <button> <img src="/icon/heart.png"/> </button> </div>
                            <div className='col col-6'> <button> <img src="/icon/photapp-bw.png"/> </button> </div>
                        </div>
                    </div>
                    <div className='col col-fill'></div>
                    <div className='col col-1'>
                        <button> <img src="/icon/bookmark.png"/> </button>
                    </div>
                </div>

                <div className='post-comments'>
                    {post.caption?
                        <div className='comment'>
                            <span className='user'> <Link to={`/user/${post.username}`}>{post.username}</Link> </span>
                            <span className='msg'>
                                <span>{postComment}</span>
                                <span>{ 
                                    isFullComment
                                    ? (caption.length > caption_limit ? <a onClick={_=>show('less')}> (less) </a> : "")
                                    : <a onClick={_=>show('more')}> (more) </a>
                                }</span>
                            </span>
                        </div>
                    : "" }
                    {post.comment_count?
                        <div className='more'>
                            <Link to={`/post/${post.post_id}`}>View all {post.comment_count} comment{post.comment_count>1?'s':''}</Link>
                        </div>
                    : ""}
                    {logged && post.auth_user_comment?
                        <div className='comment auth-user-comment'>
                            <div> ... </div>
                            <span className='user'> <Link to={`/user/${user.username}`}> {user.username} </Link> </span>
                            <span className='msg'> {limit(post.auth_user_comment, 50)} </span>
                        </div>
                    : ""}
                </div>

                <div className='add-comment row hide-mobile'>
                    <div className='col col-fill'>
                        <input type='text' value={commentText} placeholder='Add a comment..' onChange={_=>setCommentText(_.target.value)}/>
                    </div>
                    <div className='col col-1'>
                        <button className='post' disabled={commentText.trim().length < 1}> Post </button>
                    </div>
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
