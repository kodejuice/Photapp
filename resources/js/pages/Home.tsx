import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import useSWR from '../helpers/swr';
import InfiniteScroll from 'react-infinite-scroll-component';
import Toggle from 'react-toggle';
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

const compactViewIcon = <svg viewBox="0 0 66 50" fill="#fafafa"><path fill="#fafafa" d="M711,348.280776 L711,350 C711,351.656854 709.656854,353 708,353 L672,353 C670.343146,353 669,351.656854 669,350 L669,348.280776 L660.727607,350.348875 C659.120222,350.750721 657.491419,349.773439 657.089572,348.166054 C657.030082,347.928092 657,347.683733 657,347.438447 L657,318.561553 C657,316.904699 658.343146,315.561553 660,315.561553 C660.245285,315.561553 660.489645,315.591635 660.727607,315.651125 L669,317.719224 L669,316 C669,314.343146 670.343146,313 672,313 L708,313 C709.656854,313 711,314.343146 711,316 L711,317.719224 L719.272393,315.651125 C719.510355,315.591635 719.754715,315.561553 720,315.561553 C721.656854,315.561553 723,316.904699 723,318.561553 L723,347.438447 C723,347.683733 722.969918,347.928092 722.910428,348.166054 C722.508581,349.773439 720.879778,350.750721 719.272393,350.348875 L711,348.280776 Z M681.571429,351 L686.944286,345.3585 L681.031412,339.445625 L671.055272,350.328686 C671.191231,350.719509 671.562859,351 672,351 L681.571429,351 Z M684.333333,351 L708,351 C708.552285,351 709,350.552285 709,350 L709,340.380199 L701.974621,332.476648 L684.333333,351 Z M709,337.369801 L709,316 C709,315.447715 708.552285,315 708,315 L672,315 C671.447715,315 671,315.447715 671,316 L671,347.429198 L680.262846,337.324275 C680.647557,336.904591 681.304529,336.890316 681.707107,337.292893 L688.324007,343.909793 L701.275862,330.310345 C701.679338,329.886695 702.35873,329.898372 702.747409,330.335636 L709,337.369801 Z M660.242536,317.59141 C660.163215,317.57158 660.081762,317.561553 660,317.561553 C659.447715,317.561553 659,318.009268 659,318.561553 L659,347.438447 C659,347.520209 659.010027,347.601662 659.029857,347.680983 C659.163806,348.216778 659.706741,348.542538 660.242536,348.40859 L669,346.219224 L669,319.780776 L660.242536,317.59141 Z M719.757464,348.40859 C720.293259,348.542538 720.836194,348.216778 720.970143,347.680983 C720.989973,347.601662 721,347.520209 721,347.438447 L721,318.561553 C721,318.009268 720.552285,317.561553 720,317.561553 C719.918238,317.561553 719.836785,317.57158 719.757464,317.59141 L711,319.780776 L711,346.219224 L719.757464,348.40859 Z M681,332 C678.238576,332 676,329.761424 676,327 C676,324.238576 678.238576,322 681,322 C683.761424,322 686,324.238576 686,327 C686,329.761424 683.761424,332 681,332 Z M681,330 C682.656854,330 684,328.656854 684,327 C684,325.343146 682.656854,324 681,324 C679.343146,324 678,325.343146 678,327 C678,328.656854 679.343146,330 681,330 Z" transform="translate(-657 -313)"/></svg>;
const listViewIcon = <svg viewBox="0 0 100 125" enable-background="new 0 0 100 100" fill="#fafafa" ><path fill="#fafafa" d="M30,37.5H10c-1.4,0-2.5,1.1-2.5,2.5v20c0,1.4,1.1,2.5,2.5,2.5h20c1.4,0,2.5-1.1,2.5-2.5V40C32.5,38.6,31.4,37.5,30,37.5z   M27.5,57.5h-15v-15h15V57.5z"/><path d="M30,7.5H10c-1.4,0-2.5,1.1-2.5,2.5v20c0,1.4,1.1,2.5,2.5,2.5h20c1.4,0,2.5-1.1,2.5-2.5V10C32.5,8.6,31.4,7.5,30,7.5z   M27.5,27.5h-15v-15h15V27.5z"/><path d="M30,67.5H10c-1.4,0-2.5,1.1-2.5,2.5v20c0,1.4,1.1,2.5,2.5,2.5h20c1.4,0,2.5-1.1,2.5-2.5V70C32.5,68.6,31.4,67.5,30,67.5z   M27.5,87.5h-15v-15h15V87.5z"/><path d="M90,12.5H40c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5h50c1.4,0,2.5-1.1,2.5-2.5S91.4,12.5,90,12.5z"/><path d="M90,42.5H40c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5h50c1.4,0,2.5-1.1,2.5-2.5S91.4,42.5,90,42.5z"/><path d="M90,72.5H40c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5h50c1.4,0,2.5-1.1,2.5-2.5S91.4,72.5,90,72.5z"/><path d="M40,27.5h30c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5H40c-1.4,0-2.5,1.1-2.5,2.5S38.6,27.5,40,27.5z"/><path d="M40,57.5h30c1.4,0,2.5-1.1,2.5-2.5s-1.1-2.5-2.5-2.5H40c-1.4,0-2.5,1.1-2.5,2.5S38.6,57.5,40,57.5z"/><path d="M70,82.5H40c-1.4,0-2.5,1.1-2.5,2.5s1.1,2.5,2.5,2.5h30c1.4,0,2.5-1.1,2.5-2.5S71.4,82.5,70,82.5z"/></svg>;

type views = 'home' | 'full';
const toggleView:{[index:string]:views} = {
    'full':'home',
    'home':'full',
};


const Home: React.FC<{}> = ()=>{
    const dispatch = useDispatch();
    const {user, logged} = authUser();

    const [offset, setOffset] = useState(0);
    const [postToBeShown, setPostToBeShown] = useState(POST_PER_PAGE);
    const [postView, setPostView] = useState<views>('home');

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
                    <Toggle
                        defaultChecked={postView=='full'}
                        icons={{
                            checked: listViewIcon,
                            unchecked: compactViewIcon,
                        }}
                        onChange={()=>setPostView(toggleView[postView])}
                    />
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
