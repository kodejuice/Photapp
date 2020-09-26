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
const deleteIcon = <svg viewBox="0 0 64 64" width="15" height="15"><path fill="#e0678f" d="M32 3A29 29 0 1 0 32 61A29 29 0 1 0 32 3Z"/><path fill="#ed7899" d="M32 8A24 24 0 1 0 32 56A24 24 0 1 0 32 8Z"/><path fill="#fff" d="M42.849,16.908L32,27.757L21.151,16.908c-0.391-0.391-1.024-0.391-1.414,0l-2.828,2.828 c-0.391,0.391-0.391,1.024,0,1.414L27.757,32L16.908,42.849c-0.391,0.391-0.391,1.024,0,1.414l2.828,2.828 c0.391,0.391,1.024,0.391,1.414,0L32,36.243l10.849,10.849c0.391,0.391,1.024,0.391,1.414,0l2.828-2.828 c0.391-0.391,0.391-1.024,0-1.414L36.243,32l10.849-10.849c0.391-0.391,0.391-1.024,0-1.414l-2.828-2.828 C43.873,16.518,43.24,16.518,42.849,16.908z"/><path fill="#faefde" d="M47.713 43.471L36.243 32 32 27.757 20.529 16.287 16.287 20.529 27.757 32 16.287 43.471 20.529 47.713 32 36.243 43.471 47.713z"/><path fill="#fff7f0" d="M47.506,20.737L43.3,16.457l-11.18,11.42L21.237,16.994c-1.172,1.172-1.172,3.071,0,4.243 l21.527,21.527c1.172,1.172,3.071,1.172,4.243,0L36.123,31.88L47.506,20.737z"/><path fill="#8d6c9f" d="M32,2C15.458,2,2,15.458,2,32s13.458,30,30,30s30-13.458,30-30S48.542,2,32,2z M32,60 C16.561,60,4,47.439,4,32S16.561,4,32,4s28,12.561,28,28S47.439,60,32,60z"/><path fill="#8d6c9f" d="M37.657,32l10.142-10.142c0.78-0.78,0.78-2.049,0-2.829l-2.828-2.828 c-0.78-0.781-2.05-0.781-2.829,0L32,26.343L21.858,16.201c-0.778-0.78-2.048-0.78-2.829,0l-2.828,2.828 c-0.78,0.78-0.78,2.049,0,2.829L26.343,32L16.201,42.142c-0.78,0.78-0.78,2.049,0,2.829l2.828,2.828 c0.779,0.78,2.049,0.779,2.829,0L32,37.657l10.142,10.142c0.39,0.39,0.902,0.585,1.415,0.585c0.512,0,1.024-0.195,1.414-0.585 l2.828-2.828c0.78-0.78,0.78-2.049,0-2.829L37.657,32z M43.556,46.385L32,34.829L20.443,46.385l-2.828-2.829L29.171,32 L17.615,20.443l2.829-2.828L32,29.171l11.556-11.556l2.829,2.829L34.829,32l11.556,11.557L43.556,46.385z"/><path fill="#8d6c9f" d="M41.899 30.586c-.391.391-.391 1.024 0 1.414l1.415 1.414c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.024 0-1.414l-1.415-1.414C42.923 30.195 42.289 30.195 41.899 30.586zM46.849 27.05c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414l1.414 1.414c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414L46.849 27.05zM51.799 24.929l-1.414-1.415c-.391-.391-1.023-.391-1.414 0-.391.39-.391 1.023 0 1.414l1.414 1.415c.195.195.451.293.707.293s.512-.098.707-.293C52.189 25.953 52.189 25.32 51.799 24.929zM13.615 37.657c-.391-.391-1.023-.391-1.414 0-.391.39-.391 1.023 0 1.414l1.414 1.415c.195.195.451.293.707.293s.512-.098.707-.293c.391-.39.391-1.023 0-1.414L13.615 37.657zM17.151 36.95c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023 0-1.414l-1.414-1.414c-.391-.391-1.023-.391-1.414 0s-.391 1.023 0 1.414L17.151 36.95zM21.394 33.707c.256 0 .512-.098.707-.293.391-.391.391-1.024 0-1.414l-1.415-1.414c-.391-.391-1.024-.391-1.414 0-.391.391-.391 1.024 0 1.414l1.415 1.414C20.882 33.609 21.138 33.707 21.394 33.707z"/></svg>;

//  sort comments properly

const W = window as any;

type CommentProps = {
    text: string,
    likes?: number,
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
                {deleteIcon}
            </button>
        </div>
    );
}


const SingleComment: React.FC<CommentProps> = ({text, author, likes, comment_id, auth_user_likes, profile_pic, how_long})=>{
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
                    </span>
                    <div className='comment-info'>
                        <span className='hw'>{how_long}</span>
                        {comment_id && <span className='hw bold'>{likes} likes</span>}
                    </div>
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
                        {data && data.slice(0,limit).map(({message, likes, comment_id, username, auth_user_likes, profile_pic, created_at})=>(
                            <SingleComment
                                key={username+comment_id}
                                text={message}
                                likes={likes}
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
