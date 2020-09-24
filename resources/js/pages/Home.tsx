import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import useSWR from '../helpers/swr';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookie from 'js-cookie';
import {Toggle} from '../helpers/mini-components';
import "react-toggle/style.css";
import authUser from '../state/auth_user';

import {LazyDPSync} from '../components/LazyDP';
import {fetchListing} from '../helpers/fetcher';
import showAlert from '../components/Alert/showAlert';

import Posts from '../components/Posts';
import Suggestions from '../components/Suggestions';

import Header from '../components/Header';
import Spinner from '../components/Spinner';

let ALL_POST: any[] = [];
const POST_PER_PAGE = 50;


const Home: React.FC<{}> = ()=>{
    const dispatch = useDispatch();
    const {user, logged} = authUser();

    const [offset, setOffset] = useState(0);
    const [postToBeShown, setPostToBeShown] = useState(POST_PER_PAGE);
    const [postView, setPostView] = useState<'home'|'full'>(Cookie.get('post_view') || 'home');

    let {data, isLoading, isError} = usePosts(offset);

    if (data?.errors) {
        showAlert(dispatch, data.errors, 'error', 60);
        isError = true, data = null;
    }

    // clear all posts if offset is zero,
    // this occurs if
    //  1) no posts are loaded yet
    //  2) posts were refreshed
    //
    if (offset == 0) {
        // only clear if we have data to replace with
        // (a refresh action)
        if (data) {
            ALL_POST = [];
        }
    }

    mergePosts(ALL_POST, data);

    return (
        <React.Fragment>
            <Header page='/' />

            <div className='row posts-wrapper' role={isError ? 'post-wrapper-err' : 'post-wrapper'}>
                <div className='post-view-toggle col-12'>
                    {ALL_POST.length>0 && <Toggle
                        current={postView}
                        setState={setPostView}
                    />}
                </div>

                <div className='home-posts col col-9'>
                    { isLoading && offset==0 && <Spinner /> }

                    {ALL_POST.length > 0 && (
                        <InfiniteScroll
                            dataLength={postToBeShown}
                            next={()=>{
                                if (postToBeShown >= ALL_POST.length) {
                                    // setting the offset state causes the
                                    //  app to fetch new posts from the server
                                    //  with this offset as starting point
                                    setOffset(Math.min(postToBeShown, ALL_POST.length));
                                    setPostToBeShown(Math.min(postToBeShown + POST_PER_PAGE, ALL_POST.length));
                                } else {
                                    // reveal 10 more posts
                                    setPostToBeShown(Math.min(postToBeShown+10, ALL_POST.length));
                                }
                            }}
                            hasMore={data && data.length > 0}
                            loader={ <span></span> }
                            endMessage={ !isLoading && <p id='msg'> &#8593; Thats all! </p> }

                            // pull down functionality
                            pullDownToRefresh
                            refreshFunction={()=>(setOffset(0), setPostToBeShown(POST_PER_PAGE))}
                            pullDownToRefreshContent={ <p id='msg'>&#8595; Pull down to refresh</p> }
                            releaseToRefreshContent={ <p id='msg'>&#8593; Release to refresh</p> }
                        >

                            <Posts data={ALL_POST.slice(0, postToBeShown)} view={postView} />

                            {isLoading && offset>0 && <Spinner type='list' />}

                        </InfiniteScroll>
                    )}
                </div>
                <div className='col col-1 separator'></div>
                <div className='col col-fill sm-hide' style={{position: 'relative'}}>
                    <div className='fixxed user-col'>
                        <div className='suggestions-column'>

                            {logged && (
                                <div className='auth_user row'>
                                    <div className='col col-2'> <Link to={`/user/${user.username}`}><LazyDPSync data={user} /></Link></div>
                                    <div className='col col-fill user-info'>
                                        <div className='username'><Link to={`/user/${user.username}`}>{user.username}</Link></div>
                                        <div className='full_name'>{user.full_name}</div>
                                    </div>
                                </div>
                            )}

                            <div className='row'>
                                <p id='c-title' className='col col-fill'> Suggested For You </p>
                                <p id='see-more' className='col col-3'> <Link to="/explore/people">See All</Link> </p>
                            </div>
                            <div className='users'>
                                <Suggestions />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


/**
 * merge two array of posts together
 *  discarding duplicates
 * @param  {Post[]} all_posts         original post
 * @param  {Post[]} new_posts         post to merge with
 */
function mergePosts(all_posts: any[], new_posts: any[]) {
    if (!new_posts) return;
    const ids = new Set(all_posts.map(o => o.post_id));

    for (let p of new_posts) {
        if (!ids.has(p.post_id)) {
            all_posts.push(p);
        }
    }
}


/**
 * usePosts hook, 
 * fetches posts from db w/ SWR
 */
function usePosts(offset) {
    const LIMIT = POST_PER_PAGE * 2;
    const { data, error } = useSWR(`/api/posts?limit=${LIMIT}&offset=${offset}`, fetchListing);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}


export default Home;
