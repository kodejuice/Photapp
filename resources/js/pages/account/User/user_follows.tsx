import React, {useState} from 'react';
import Router from 'react-router-dom';
import {useDispatch} from 'react-redux';

import useSWR from '../../../helpers/swr';
import {fetchListing} from '../../../helpers/fetcher';

import Header from '../../../components/Header';
import showAlert from '../../../components/Alert/showAlert';
import Spinner from '../../../components/Spinner';

import Users from '../../../components/Users';

const LIMIT = 100;

const UserFollow: React.FC<{username: string, type:'followers'|'following'}> = ({username, type})=>{
    const dispatch = useDispatch();
    let {data, isLoading, isError} = useFollows(username, type);

    if (data?.errors) {
        showAlert(dispatch, data.errors, 'error', 15);
        data = null;
    }

    return (
        <React.Fragment>
            <div className='user-follow users suggestions'>
                { isLoading && <Spinner type='list' /> }

                { data && <Users show_full_name={type=='followers'} data={data} rdr={true} /> }

                {data && data.length>LIMIT && (
                    <div className='row'>
                        <div className='col col-1'></div>
                        <div id='more'> and more </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}


/**
 * fetches user followers/following from db w/ SWR
 */
function useFollows(user: string, type: 'following'|'followers') {
    // const { data, error } = useSWR(`/api/users?limit=${LIMIT+1}`, fetchListing);
    const { data, error } = useSWR(`/api/user/${user}/${type}?limit=${LIMIT+1}`, fetchListing);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}


export default UserFollow;
