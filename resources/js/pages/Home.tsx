import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import useSWR from '../helpers/swr';

import {fetchListing} from '../helpers/fetcher';
import showAlert from '../components/Alert/showAlert';

import Posts from '../components/Posts';

import Header from '../components/Header';
import Spinner from '../components/Spinner';


const POST_PER_PAGE = 50;

const Home: React.FC<{}> = ()=>{
    const dispatch = useDispatch();
    const [offset, setOffset] = useState(0);
    let {data, isLoading, isError} = usePosts(offset);

    if (data?.errors) {
        showAlert(dispatch, data.errors, 'error', 60);
        data = null;
    }

    return (
        <React.Fragment>
            <Header page='/' />

            <div className='row posts-wrapper'>
                <div className='home-posts col col-9'>
                    {isLoading ? <Spinner /> : "" }
                    {data ? <Posts data={data} view='home'/> : ""}
                </div>

                <div className='col col-fill sm-hide'>
                    <div style={{width: '92%',margin: '0 auto'}}>
                        Suggested for you
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}


/**
 * usePosts hook, 
 * fetches posts from db w/ SWR
 */
function usePosts(offset) {
    const { data, error } = useSWR(`/api/posts?limit=${POST_PER_PAGE}&offset=${offset}`, fetchListing);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}


export default Home;

