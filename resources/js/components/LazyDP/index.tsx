import React, {useState} from 'react';
import useSWR from 'swr';
import {fetchUser} from '../../helpers/fetcher';

const default_avatar = '/icon/avatar.png';


/**
 * lazily/dynamically load user profile picture
 * @param {string} props.user     username
 */
export default function LazyDP({user}) {
    const {data, isLoading, isError} = useUser(user);

    // load default_image if dp image url is invalid
    const onError = (ev: React.SyntheticEvent<HTMLImageElement>)=>{
        (ev.target as HTMLImageElement).src = default_avatar;
    };

    const url = (isError || isLoading || (!data?.profile_pic))
        ? default_avatar
        :`/avatar/${data.profile_pic}`;

    return <img src={url} onError={onError} />;
}


/**
 * useUser hook
 * @param  string   username
 */
function useUser(user) {
    const { data, error } = useSWR(user, fetchUser);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}
