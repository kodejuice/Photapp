import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import useSWR from '../../helpers/swr';
import {mutate as global_mutate} from 'swr';
import {useDispatch} from 'react-redux';

import authUser from '../../state/auth_user';
import LazyDP, {LazyDPSync} from '../LazyDP';
import showAlert from '../../components/Alert/showAlert';
import {ProcessUserInput, heartIcon_blank, heartIcon, plusIcon, deleteIcon} from '../../helpers/mini-components';
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
