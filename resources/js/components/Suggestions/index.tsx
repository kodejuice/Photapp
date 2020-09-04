import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

import authUser from '../../state/auth_user';
import useSWR from '../../helpers/swr';
import {fetchListing} from '../../helpers/fetcher';

import LazyDP from '../../components/LazyDP';
import FollowButton from '../../components/FollowButton';
import showAlert from '../../components/Alert/showAlert';
import Spinner from '../../components/Spinner';

const Suggestions: React.FC<{}> = ({})=>{
    const {user, logged} = authUser();
    const dispatch = useDispatch();
    let {data, isLoading, isError} = useUsers();

    if (data?.errors) {
        showAlert(dispatch, data.errors, 'error', 15);
        data = null;
    }


    return (
        <React.Fragment>
            { isLoading ? <Spinner type='list' /> : ""}

            <div className='users'>
                { data && data.map(({username, profile_pic, auth_user_follows, follows_auth_user})=> (
                    <div className='user row' key={username}>
                        <div className='col col-2'> <LazyDP user={username} /> </div>
                        <div className='col col-fill'>
                            <div className='username'>{username}</div>
                            {logged && <div className='follow-info'>{follows_auth_user ? "Follows You" : ""}</div>}
                        </div>
                        <div className='col col-2 follow-col'> <FollowButton user={username} unfollow={auth_user_follows} /> </div>
                    </div>
                )) }
            </div>

        </React.Fragment>
    );
}


/**
 * useUsers hook, 
 * fetches users from db w/ SWR
 */
function useUsers() {
    const { data, error } = useSWR(`/api/users?limit=5&suggest=1`, fetchListing);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}


export default Suggestions;
