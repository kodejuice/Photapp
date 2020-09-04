import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import useSWR from '../helpers/swr';
import InfiniteScroll from 'react-infinite-scroll-component';

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
    const [offset, setOffset] = useState(0);
    const [postShown, setPostShown] = useState(POST_PER_PAGE);

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
                <div className='home-posts col col-9'>
                    { isLoading && offset==0 && <Spinner /> }

                    {ALL_POST.length > 0 && (
                        <InfiniteScroll
                            dataLength={postShown}
                            next={()=>{
                                if (postShown >= ALL_POST.length) {
                                    // setting the offset state causes the
                                    //  app to fetch new posts from the server
                                    //  with this offset as starting point
                                    setOffset(Math.min(postShown, ALL_POST.length));
                                    setPostShown(Math.min(postShown + POST_PER_PAGE, ALL_POST.length));
                                } else {
                                    // reveal 10 more posts
                                    setPostShown(Math.min(postShown+10, ALL_POST.length));
                                }
                            }}
                            hasMore={data && data.length > 0}
                            loader={ <span></span> }
                            endMessage={ !isLoading && <p id='msg'> &#8593; Thats all! </p> }

                            // pull down functionality
                            pullDownToRefresh
                            refreshFunction={()=>(setOffset(0), setPostShown(POST_PER_PAGE))}
                            pullDownToRefreshContent={ <p id='msg'>&#8595; Pull down to refresh</p> }
                            releaseToRefreshContent={ <p id='msg'>&#8593; Release to refresh</p> }
                        >

                            <Posts data={ALL_POST.slice(0, postShown)} view='home'/>

                            {isLoading && offset>0 && <Spinner type='list' />}

                        </InfiniteScroll>
                    )}
                </div>

                <div className='col col-fill sm-hide'>

                        <div className='row'>
                            <p id='c-title' className='col col-fill'> Suggested For You </p>
                            <p id='see-more' className='col col-2'> <Link to="/explore/people">See All</Link> </p>
                        </div>
                        <div className='users'>
                            <Suggestions />
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
