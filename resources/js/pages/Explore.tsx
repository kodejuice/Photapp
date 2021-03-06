import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

import Header from '../components/Header';
import useSWR from '../helpers/swr';

import authUser from '../state/auth_user'; 
import {merge_objects} from '../helpers/util';
import {fetchListing} from '../helpers/fetcher';
import Spinner from '../components/Spinner';
import showAlert from '../components/Alert/showAlert';

import "./styles/Explore.scss";

import Posts from '../components/Posts';


let ALL_POST: any[] = [];
const POST_PER_PAGE = 100;


const UserFeed: React.FC<{}> = ()=>{
    const dispatch = useDispatch();
    const {logged} = authUser();

    const [offset, setOffset] = useState(0);
    const [postToBeShown, setPostToBeShown] = useState(POST_PER_PAGE);

    let {data, isError, isLoading} = useUserFeed(offset);

    if (data?.errors) {
        showAlert(dispatch, data.errors, 'error', 60);
        isError = true, data = null;
    }

    merge_objects('post_id', ALL_POST, data);

    return (
        <React.Fragment>
            {isLoading && offset==0 && <Spinner type='list' />}

            {data && data.length == 0 && ALL_POST.length==0 && (
                logged
                ? <p id='explore-msg'> Nothing here, <Link to="/explore/people">follow more people</Link> </p>
                : <p id='explore-msg'> Nothing here, this is unusual. Try reloading the page </p>
            )}

            {ALL_POST.length > 0 && (
                <div className='grid-container' role='grid-container'>
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
                            hasMore={isLoading || (data && data.length > 0)}
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
    const [query, setQuery] = useState("");
    const history = useHistory();

    const Search = (ev)=>{
        ev.preventDefault();
        history.push(`/explore/search/${query}`);
    }

    return (
        <React.Fragment>
            <Header page='explore' hide_icon={true} header_title="Explore" />

            <div className='explore-page'>
                <div className='search-box'>
                    <div className='row'>
                        <div className='col col-fill'>
                            <form onSubmit={Search}>
                                <input value={query} className='search-input' placeholder="Search"
                                    name='search'
                                    onChange={e=>setQuery(e.target.value)}
                                    onFocus={()=>showFeed(false)}
                                    onBlur={()=>showFeed(true)}
                                />
                            </form>
                        </div>
                        <div className='col col-2'>{
                            query.trim().length
                            ? <div id='btn-wrp'> <button onClick={Search}>Search</button> </div>
                            : <div id='btn-wrp'> <button onClick={()=>showFeed(true)}>Cancel</button> </div>
                        }</div>
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
 * useUserFeed hook, 
 * fetches users feed from db w/ SWR
 */
function useUserFeed(offset) {
    const LIMIT = POST_PER_PAGE * 2;
    const { data, error } = useSWR(`/api/posts?limit=${LIMIT}&offset=${offset}&my_feed=1`, fetchListing);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}


export default Explore;
