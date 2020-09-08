import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

import Header from '../components/Header';
import useSWR from '../helpers/swr';

import {fetchListing} from '../helpers/fetcher';
import Spinner from '../components/Spinner';
import showAlert from '../components/Alert/showAlert';

import "./styles/Explore.scss";

import Posts from '../components/Posts';

// TODO:
// - video thumbnail


let ALL_POST: any[] = [];
const POST_PER_PAGE = 50;


const UserFeed: React.FC<{}> = ()=>{
    const dispatch = useDispatch();

    const [offset, setOffset] = useState(0);
    const [postToBeShown, setPostToBeShown] = useState(POST_PER_PAGE);

    let {data, isError, isLoading} = useUserFeed(offset);

    if (data?.errors) {
        showAlert(dispatch, data.errors, 'error', 60);
        isError = true, data = null;
    }

    mergePosts(ALL_POST, data);

    return (
        <React.Fragment>
            {isLoading && <Spinner type='list' />}

            {ALL_POST.length > 0 && (
                <div className='grid-container'>
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
                            hasMore={isLoading ? true : data && data.length > 0}
                            loader={ <span></span> }
                            endMessage={ !isLoading && <p id='msg'> &#8593; Thats all! </p> }
                        >

                            <Posts data={ALL_POST.slice(0, postToBeShown)} view="grid" />

                            {isLoading && offset>0 && <Spinner type='list' />}

                        </InfiniteScroll>

                </div>
            )}
        </React.Fragment>
    );
}



const Explore: React.FC<{}> = ()=>{
    const [feedShown, showFeed] = useState(true);

    return (
        <React.Fragment>
            <Header page='explore' hide_icon={true} header_title="Explore" />

            <div className='explore-page'>
                <div className='search-box'>
                    <div className='row'>
                        <div className='col col-fill'>
                            <input className='search-input' placeholder="Search" onFocus={()=>showFeed(false)} onBlur={()=>showFeed(true)} />
                        </div>
                        <div className='col col-2'> <div id='btn-wrp'> <button onClick={()=>showFeed(true)}>Cancel</button> </div> </div>
                    </div>
                </div>

                {feedShown && (
                    <div className="auth_user_feed">
                        <UserFeed />
                    </div>
                )}
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
 * useUserFeed hook, 
 * fetches users feed from db w/ SWR
 */
function useUserFeed(offset) {
    const LIMIT = POST_PER_PAGE * 2;
    const { data, error } = useSWR(`/api/posts?limit=${LIMIT}&offset=${offset}`, fetchListing);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}


export default Explore;
