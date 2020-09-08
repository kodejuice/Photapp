import React, {useState} from 'react';
import Header from '../components/Header';
import {fetchListing} from '../helpers/fetcher';
import useSWR from '../helpers/swr';

import "./styles/Explore.scss";

import Posts from '../components/Posts';


const UserFeed: React.FC<{}> = ()=>{
    const {data, isError, isLoading} = useUserFeed();

    return (
        <React.Fragment>
            {data && (
                <div className='grid-container'>
                    <Posts view="grid" data={data} />
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
 * hook to get users posts feed
 * @return {[type]} [description]
 */
function useUserFeed() {
    const {data, error} = useSWR('/api/posts', fetchListing);

    return {
        data,
        isError: error,
        isLoading: !error && !data,
    };
}


export default Explore;
