import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import useSWR from '../../helpers/swr';
import {fetchListing} from '../../helpers/fetcher';

import showAlert from '../../components/Alert/showAlert';
import Spinner from '../../components/Spinner';

import Users from '../Users';

const center: React.CSSProperties = {
    textAlign: 'center',
}

const Suggestions: React.FC<{limit?:number}> = ({limit})=>{
    const dispatch = useDispatch();
    let {data, isLoading, mutate, isError} = useUsers(limit || 5);

    if (data?.errors) {
        showAlert(dispatch, data.errors, 'error', 15);
        data = null;
    }

    return (
        <React.Fragment>
            { isLoading ? <Spinner type='list' /> : ""}

            <div className='users'>
                { data && <Users mutate={mutate} data={data} /> }
                { data && data.length==0 && <p style={center}> Nobody here </p>}
            </div>
        </React.Fragment>
    );
}


/**
 * useUsers hook, 
 * fetches users from db w/ SWR
 */
function useUsers(limit) {
    const { data, mutate, error } = useSWR(`/api/users?limit=${limit}&suggest=1`, fetchListing);
    return {
        data,
        mutate,
        isLoading: !error && !data,
        isError: error
    }
}


export default Suggestions;
