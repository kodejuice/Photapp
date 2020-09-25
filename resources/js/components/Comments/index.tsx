import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import authUser from '../../state/auth_user';
import LazyDP, {LazyDPSync} from '../LazyDP';
import showAlert from '../../components/Alert/showAlert';
import {fetchListing} from '../../helpers/fetcher';
import {ProcessUserInput} from '../../helpers/mini-components';
import {howLong} from '../../helpers/date-time';
import {limit, merge_objects} from '../../helpers/util';
import Spinner from '../../components/Spinner';

import AddComment from '../../components/Posts/HomeView/AddComment';

import "./style.scss";

const heartIcon_blank = <svg viewBox="0 0 50 50" width="15" height="15"><path fill="#fafafa" stroke="#262626" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M35,8c-4.176,0-7.851,2.136-10,5.373C22.851,10.136,19.176,8,15,8C8.373,8,3,13.373,3,20c0,14,16,21,22,26c6-5,22-12,22-26C47,13.373,41.627,8,35,8z"/></svg>;
const heartIcon = <img src="/icon/heart.png" width="15" height="15" />;

const addIcon = <svg viewBox="0 0 64 64" width="32px" height="32px"><path fill="#85cbf8" d="M31 3A28 28 0 1 0 31 59A28 28 0 1 0 31 3Z"/><path fill="#c2cde7" d="M31,3A28,28,0,1,0,59,31,28,28,0,0,0,31,3Zm0,50A22,22,0,1,1,46.17,15.07l.68.67q.39.4.75.82A22,22,0,0,1,31,53Z"/><path fill="#acb7d0" d="M31,53A22,22,0,0,1,9,31H7.34a4,4,0,0,0-3.95,4.71,28,28,0,0,0,55.21,0A4,4,0,0,0,54.66,31H53A22,22,0,0,1,31,53Z"/><path fill="#8d6c9f" d="M31,2A29,29,0,1,0,60,31,29,29,0,0,0,31,2Zm0,56A27,27,0,1,1,58,31,27,27,0,0,1,31,58Z"/><path fill="#8d6c9f" d="M31 50a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V51A1 1 0 0 0 31 50zM37 50.08a1 1 0 0 0-1.93.52l.52 1.93A1 1 0 0 0 37.53 52zM21.75 47.52a1 1 0 0 0-1.37.37l-1 1.73a1 1 0 1 0 1.73 1l1-1.73A1 1 0 0 0 21.75 47.52zM41.62 47.89a1 1 0 1 0-1.73 1l1 1.73a1 1 0 1 0 1.73-1zM26.21 49.37a1 1 0 0 0-1.22.71L24.47 52a1 1 0 1 0 1.93.52l.52-1.93A1 1 0 0 0 26.21 49.37z"/><path fill="#faefde" d="M43,30H32V19a1,1,0,0,0-2,0V30H19a1,1,0,0,0,0,2H30V43a1,1,0,0,0,2,0V32H43a1,1,0,0,0,0-2Z"/><path fill="#8d6c9f" d="M38.35 11.32a21 21 0 0 1 2.1.92 1 1 0 0 0 .9-1.79 23 23 0 0 0-2.3-1 1 1 0 1 0-.7 1.87zM16.15 16.15a21.08 21.08 0 0 1 18.19-5.88 1 1 0 1 0 .32-2 23 23 0 0 0-19.92 39 1 1 0 0 0 1.41-1.41A21 21 0 0 1 16.15 16.15zM47.26 14.74a23.19 23.19 0 0 0-2.09-1.86 1 1 0 0 0-1.23 1.57 21.26 21.26 0 0 1 1.91 1.7 21 21 0 0 1 0 29.7 1 1 0 1 0 1.41 1.41A23 23 0 0 0 47.26 14.74z"/></svg>;

const W = window as any;

// AddComment component


type CommentProps = {
    text: string,
    author: string,
    how_long: string,
    profile_pic?: string,
    comment_id?: number,
    auth_user_likes?: boolean,
}

type DeleteButtonProps = {
    comment_id: number,
    showComment: React.Dispatch<React.SetStateAction<boolean>>,
}

type LikeButtonProps = {
    comment_id: number,
    dislike: boolean,
}

/**
 * component to like comment
 * @param  {number} comment_id
 * @param  {boolean} dislike
 */
const LikeButton: React.FC<LikeButtonProps> = ({comment_id, dislike})=>{
    const [commentLikes, setLikeComment] = useState(!dislike);

    const likeComment = ()=>{
        const like = commentLikes;
        setLikeComment(!like);
        // TODO: like comment
    };

    return (
        <div className='action-button'>
            <button onClick={likeComment}>
                {commentLikes ? heartIcon_blank : heartIcon}
            </button>
        </div>
    );
}


/**
 * component to delete comment
 * @param  {number} comment_id
 * @param  {Dispatch<SetStateAction<boolean>>} showComment
 */
let deletedComments: Set<number>;
const DeleteButton: React.FC<DeleteButtonProps> = ({comment_id, showComment})=>{

    const deleteComment = ()=>{
        // TODO: delete comment
        // onDelete:
        //     deletedComments.add(comment_id)
        //     showComment(false)
    }

    return (
        <div className='action-button'>
            <button onClick={deleteComment}>
                d
            </button>
        </div>
    );
}


const SingleComment: React.FC<CommentProps> = ({text, author, comment_id, auth_user_likes, profile_pic, how_long})=>{
    const {user, logged} = authUser();
    const [commentShown, showThisComment] = useState(true);

    const isAuthor = logged && user.username == author;
    const authUserLikes = !!(logged && comment_id && auth_user_likes);

    const comment: string = text;
    const message_limit = 100;
    const [commentMessage, setCommentMessage] = useState(limit(comment, message_limit));
    const [fullCommentShown, showFullComment] = useState(comment == commentMessage);
    const showComment = (t)=>{
        if (t == 'more') {
            setCommentMessage(comment);
        } else if (t == 'less') {
            setCommentMessage(limit(comment, message_limit));
        }
        showFullComment(t == 'more' ? true : false);
    };

    return (
        <React.Fragment>
            {commentShown && <div className='row comment'>
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
                    <span className='comment'>
                        <ProcessUserInput text={commentMessage} />
                        <span>{
                            fullCommentShown
                            ? (comment.length > message_limit ? <a onClick={()=>showComment('less')}> (less) </a> : "")
                            : <a onClick={()=>showComment('more')}> (more) </a>
                        }</span>
                        <span className='hw'>{how_long}</span>
                    </span>
                </div>
                {isAuthor && comment_id
                    ? <DeleteButton showComment={showThisComment} comment_id={comment_id} />
                    : comment_id && <LikeButton comment_id={comment_id} dislike={authUserLikes} />
                }
            </div>}
        </React.Fragment>
    );
}

const Comments: React.FC<{
    post_id: number,
    post: any,
}> = ({post, post_id})=>{
    const rendered = React.useRef(false);
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(10);
    let {data, isLoading} = useComments(post_id);

    if (data?.errors) {
        showAlert(dispatch, data.errors);
        data = null;
    }

    // initialize deleted comments set
    if (!rendered.current) {
        deletedComments = new Set();
        rendered.current = true;
    }

    return (
        <React.Fragment>
           <div className='comments'>
                {post.caption && (
                    <div className='caption'>
                        <SingleComment text={post.caption} author={post.username} how_long={howLong(post.created_at)} />
                        <div className='_border'></div>
                    </div>
                )}
                {isLoading && <Spinner type='list'/>}

                <div className='scroll-par'>
                    {data && <p id='comment-count'> {post.comment_count} comments </p>}
                    <div className='scrolling-list'>
                        {data && data.slice(0,limit).map(({message, comment_id, username, auth_user_likes, profile_pic, created_at})=>(
                            <SingleComment
                                key={username+comment_id}
                                text={message}
                                comment_id={comment_id}
                                author={username}
                                auth_user_likes={auth_user_likes}
                                profile_pic={profile_pic}
                                how_long={howLong(created_at)}
                            />
                        ))}
                        {data && limit < data.length && (
                            <div id='load-more'>
                                <button onClick={()=>setLimit(limit+10)}>
                                    {addIcon}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className='add-comment'>
                    <div className='row'>
                        <AddComment post_id={post.post_id} />
                    </div>
                </div>
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
function useComments(post_id): {data:any, isLoading:boolean} {
    const limit = 900;
    const url = `/api/post/${post_id}/comments?limit=${limit}`;

    const fetched = React.useRef(false);
    const [data, setData] = useState(W.__posts_cache__[url]);
    const [error, setError] = useState(undefined);

    // here we dont use SWR, because the number of comments may be large
    // bcos we intend to fetch alot at once and nevery fetch more,
    // SWR revalidates, which keeps making the request to the server
    // and we dont want that

    React.useEffect(()=>{
        if (!fetched.current) {
            fetchListing(url)
                .then(data => {
                    if (data?.errors && W.__posts_cache__[url]) {
                        setData(W.__posts_cache__[url])
                    } else {
                        setData(data)
                        if (!data?.errors) {
                            W.__posts_cache__[url] = data;
                        }
                    }
                })
                .catch(err => {
                    if (W.__posts_cache__[url]) {
                        setData(W.__posts_cache__[url])
                    } else {
                        setError(err)
                    }
                })
                .finally(()=>{
                    fetched.current = true;
                });
        }
    });

    return {
        data,
        isLoading: !data && !error,
    }
}


export default Comments;
