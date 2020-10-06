import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import useSWR from '../../helpers/swr';
import {mutate as global_mutate} from 'swr';
import {useDispatch} from 'react-redux';

import authUser from '../../state/auth_user';
import LazyDP, {LazyDPSync} from '../LazyDP';
import showAlert from '../../components/Alert/showAlert';
import {ProcessUserInput} from '../../helpers/mini-components';
import {howLong} from '../../helpers/date-time';
import {limit, merge_objects, amount} from '../../helpers/util';
import Spinner from '../../components/Spinner';

import {
    fetchListing,
    deletePostComment,
    likeComment as likePostComment,
    dislikeComment
} from '../../helpers/fetcher';

import AddComment from '../../components/Posts/HomeView/AddComment';

import "./style.scss";

const heartIcon_blank = <svg viewBox="0 0 50 50" width="15" height="15"><path fill="#fafafa" stroke="#262626" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M35,8c-4.176,0-7.851,2.136-10,5.373C22.851,10.136,19.176,8,15,8C8.373,8,3,13.373,3,20c0,14,16,21,22,26c6-5,22-12,22-26C47,13.373,41.627,8,35,8z"/></svg>;
const heartIcon = <img src="/icon/heart.png" width="15" height="15" />;

const plusIcon = <img src="/icon/add-bw.png" />
const deleteIcon = <svg viewBox="0 0 64 64" width="15" height="15"><path fill="#e0678f" d="M32 3A29 29 0 1 0 32 61A29 29 0 1 0 32 3Z"/><path fill="#ed7899" d="M32 8A24 24 0 1 0 32 56A24 24 0 1 0 32 8Z"/><path fill="#fff" d="M42.849,16.908L32,27.757L21.151,16.908c-0.391-0.391-1.024-0.391-1.414,0l-2.828,2.828 c-0.391,0.391-0.391,1.024,0,1.414L27.757,32L16.908,42.849c-0.391,0.391-0.391,1.024,0,1.414l2.828,2.828 c0.391,0.391,1.024,0.391,1.414,0L32,36.243l10.849,10.849c0.391,0.391,1.024,0.391,1.414,0l2.828-2.828 c0.391-0.391,0.391-1.024,0-1.414L36.243,32l10.849-10.849c0.391-0.391,0.391-1.024,0-1.414l-2.828-2.828 C43.873,16.518,43.24,16.518,42.849,16.908z"/><path fill="#faefde" d="M47.713 43.471L36.243 32 32 27.757 20.529 16.287 16.287 20.529 27.757 32 16.287 43.471 20.529 47.713 32 36.243 43.471 47.713z"/><path fill="#fff7f0" d="M47.506,20.737L43.3,16.457l-11.18,11.42L21.237,16.994c-1.172,1.172-1.172,3.071,0,4.243 l21.527,21.527c1.172,1.172,3.071,1.172,4.243,0L36.123,31.88L47.506,20.737z"/><path fill="#8d6c9f" d="M32,2C15.458,2,2,15.458,2,32s13.458,30,30,30s30-13.458,30-30S48.542,2,32,2z M32,60 C16.561,60,4,47.439,4,32S16.561,4,32,4s28,12.561,28,28S47.439,60,32,60z"/><path fill="#8d6c9f" d="M37.657,32l10.142-10.142c0.78-0.78,0.78-2.049,0-2.829l-2.828-2.828 c-0.78-0.781-2.05-0.781-2.829,0L32,26.343L21.858,16.201c-0.778-0.78-2.048-0.78-2.829,0l-2.828,2.828 c-0.78,0.78-0.78,2.049,0,2.829L26.343,32L16.201,42.142c-0.78,0.78-0.78,2.049,0,2.829l2.828,2.828 c0.779,0.78,2.049,0.779,2.829,0L32,37.657l10.142,10.142c0.39,0.39,0.902,0.585,1.415,0.585c0.512,0,1.024-0.195,1.414-0.585 l2.828-2.828c0.78-0.78,0.78-2.049,0-2.829L37.657,32z M43.556,46.385L32,34.829L20.443,46.385l-2.828-2.829L29.171,32 L17.615,20.443l2.829-2.828L32,29.171l11.556-11.556l2.829,2.829L34.829,32l11.556,11.557L43.556,46.385z"/><path fill="#8d6c9f" d="M41.899 30.586c-.391.391-.391 1.024 0 1.414l1.415 1.414c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.024 0-1.414l-1.415-1.414C42.923 30.195 42.289 30.195 41.899 30.586zM46.849 27.05c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l1.414 1.414c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414L46.849 27.05zM51.799 24.929l-1.414-1.415c-.391-.391-1.023-.391-1.414 0-.391.39-.391 1.023 0 1.414l1.414 1.415c.195.195.451.293.707.293s.512-.098.707-.293C52.189 25.953 52.189 25.32 51.799 24.929zM13.615 37.657c-.391-.391-1.023-.391-1.414 0-.391.39-.391 1.023 0 1.414l1.414 1.415c.195.195.451.293.707.293s.512-.098.707-.293c.391-.39.391-1.023 0-1.414L13.615 37.657zM17.151 36.95c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414l-1.414-1.414c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414L17.151 36.95zM21.394 33.707c.256 0 .512-.098.707-.293.391-.391.391-1.024 0-1.414l-1.415-1.414c-.391-.391-1.024-.391-1.414 0-.391.391-.391 1.024 0 1.414l1.415 1.414C20.882 33.609 21.138 33.707 21.394 33.707z"/></svg>;

const W = window as any;

type CommentProps = {
    text: string,
    likes?: number,
    author: string,
    how_long: string,
    profile_pic?: string,
    comment_id?: number,
    auth_user_likes?: boolean,
    onDelete: ()=>void,
}

type DeleteButtonProps = {
    comment_id: number,
    showComment: React.Dispatch<React.SetStateAction<boolean>>,
    onDelete: ()=>void,
}

type LikeButtonProps = {
    comment_id: number,
    dislike: boolean,
    setCommentLiked: React.Dispatch<React.SetStateAction<boolean>>,
}

/**
 * component to like comment
 * @param  {number} comment_id
 * @param  {boolean} dislike
 */
const LikeButton: React.FC<LikeButtonProps> = ({comment_id, dislike, setCommentLiked})=>{
    const [buttonInActive, setButtonInactive] = useState(!dislike);

    const likeComment = ()=>{
        const liked = buttonInActive;
        setButtonInactive(!liked);
        setCommentLiked(liked);

        const promise = liked ? likePostComment(comment_id) : dislikeComment(comment_id);
        promise
        .then(res=>{
            if (res?.errors && !res.errors[0].includes("Already")) {
                setButtonInactive(true);
                setCommentLiked(false);
                console.error(res.errors);
            }
        })
    };

    return (
        <div className='action-button'>
            <button role='comment-like-btn' onClick={likeComment}>
                {buttonInActive ? heartIcon_blank : heartIcon}
            </button>
        </div>
    );
}


/**
 * component to delete comment
 * @param  {number} comment_id
 * @param  {Dispatch<SetStateAction<boolean>>} showComment
 */
const DeleteButton: React.FC<DeleteButtonProps> = ({comment_id, showComment, onDelete})=>{
    const dispatch = useDispatch();
    const unmounted = useRef(false);

    useEffect(()=>{
        unmounted.current = false;
        return ()=>{unmounted.current = true;}
    });

    const deleteComment = ()=>{
        if (!confirm("Delete comment?")) return;

        deletePostComment(comment_id)
        .then(res=>{
            if (unmounted.current) return;
            if (res?.errors) return showAlert(dispatch, res.errors);
            if (res?.success) {
                onDelete();
                showAlert(dispatch, ['Comment deleted'], 'success');
                showComment(false);
            }
        })
    }

    return (
        <div className='action-button'>
            <button onClick={deleteComment}>
                {deleteIcon}
            </button>
        </div>
    );
}


const SingleComment: React.FC<CommentProps> = ({text, author, likes, comment_id, auth_user_likes, profile_pic, how_long, onDelete})=>{
    likes = likes||0;
    const {user, logged} = authUser();
    const [commentShown, showThisComment] = useState(true);

    const isAuthor = logged && user.username == author;
    const authUserLikes = !!(logged && comment_id && auth_user_likes);

    const [commentLiked, setCommentLiked] = useState(authUserLikes);
    const post_likes = authUserLikes && !commentLiked
        ? likes-1
        : (authUserLikes
            ? likes
            : likes + Number(commentLiked)
        );

    const message_limit = 100;
    const comment: string = text;
    const limitedCommentText = limit(text, message_limit);
    const [commentMessage, setCommentMessage] = useState(limitedCommentText);
    const [fullCommentShown, showFullComment] = useState(comment == commentMessage);
    const showComment = (t)=>{
        if (t == 'more') {
            setCommentMessage(comment);
        } else if (t == 'less') {
            setCommentMessage(limit(comment, message_limit));
        }
        showFullComment(t == 'more' ? true : false);
    };

    if (limitedCommentText != commentMessage) {
        setCommentMessage(limitedCommentText);
    }

    return (
        <React.Fragment>
            {commentShown && <div className='row comment' role={comment_id?'user-comment':'post-caption'}>
                <div className='col-3 dp'>
                    <Link to={`/user/${author}`}>
                        {profile_pic
                            ? <LazyDPSync data={{profile_pic}} />
                            : <LazyDP user={author} />
                        }
                    </Link>
                </div>
                <div className='col-fill comment-text'>
                    <span className='user'> <Link to={`/user/${author}`}> {author} </Link> </span>
                    <span className='comment' data-testid={!comment_id?'caption':''} role={comment_id?'user-comment-message':''}>
                        <ProcessUserInput text={commentMessage} />
                        <span>{
                            fullCommentShown
                            ? (comment.length > message_limit ? <a onClick={()=>showComment('less')}> (less) </a> : "")
                            : <a onClick={()=>showComment('more')}> (more) </a>
                        }</span>
                    </span>
                    <div className='comment-info'>
                        <span className='hw'>{how_long}</span>
                        {comment_id && <span role='comment-like' className='hw bold'>{amount(post_likes)} likes</span>}
                    </div>
                </div>
                {isAuthor && comment_id
                    ? <DeleteButton onDelete={onDelete} showComment={showThisComment} comment_id={comment_id} />
                    : comment_id && <LikeButton setCommentLiked={setCommentLiked} comment_id={comment_id} dislike={commentLiked} />
                }
            </div>}
        </React.Fragment>
    );
}

const Comments: React.FC<{
    post_id: number,
    post: any,
}> = ({post, post_id})=>{
    const scrollRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(10);
    let {data, mutate, isLoading} = useComments(post_id);

    if (data?.errors) {
        showAlert(dispatch, data.errors);
        data = null;
    }


    return (
        <React.Fragment>
           <div className='comments' role='comments'>
                {post.caption && (
                    <div className='caption'>
                        <SingleComment onDelete={()=>void 0} text={post.caption} author={post.username} how_long={howLong(post.created_at)} />
                        <div className='_border'></div>
                    </div>
                )}

                <div className='add-comment'>
                    <div className='row'>
                        <AddComment post_id={post.post_id} mutate={mutate} />
                    </div>
                </div>

                {isLoading && <Spinner type='list'/>}
                {data && data.length>0 && (
                    <div className='scroll-par'>
                        {data && <p id='comment-count' data-testid='comment-count'> {post.comment_count} comments </p>}
                        <div className='scrolling-list' ref={scrollRef}>
                            {data && data.slice(0,limit).map(({message, likes, comment_id, username, auth_user_likes, profile_pic, created_at})=>(
                                <SingleComment
                                    key={comment_id}
                                    text={message}
                                    likes={likes}
                                    comment_id={comment_id}
                                    author={username}
                                    auth_user_likes={auth_user_likes}
                                    profile_pic={profile_pic}
                                    how_long={howLong(created_at)}
                                    onDelete={()=>global_mutate(`${post_id}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {data && limit < data.length && (
                    <div id='load-more'>
                        <button onClick={()=>{
                            const scrollDiv = scrollRef.current as HTMLDivElement;
                            setLimit(limit+10);
                            setTimeout(()=>{
                                // scroll to bottom (smoothly)
                                scrollDiv.scroll({
                                    behavior: 'smooth',
                                    left: 0,
                                    top: scrollDiv.scrollHeight,
                                })
                            }, 500);
                        }}>
                            {plusIcon}
                        </button>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}


/**
 * useComments hook
 * fetches comments of a post from DB
 * 
 * @param  {number} post_id
 */
W.__posts_cache__ = {};
function useComments(post_id): {data:any, isLoading:boolean, mutate: Function} {
    const limit = 900;
    const url = `/api/post/${post_id}/comments?limit=${limit}`;
    const {data, error, mutate} = useSWR(url, fetchListing);

    return {
        data,
        mutate,
        isLoading: !data && !error,
    }
}


export default Comments;
