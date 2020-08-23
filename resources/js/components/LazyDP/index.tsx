import React, {useState} from 'react';
import useSWR from 'swr';
import {fetchUser} from '../../helpers/fetcher';

const default_avatar = '/icon/avatar.png';

/**
 * dynamically load user profile picture
 * @param {string} props.user     username
 */
export default function LazyDP({user}) {
    const {data, isLoading, isError} = useUser(user);

    const url = (isError || isLoading || (data && !data.profile_pic))
        ? default_avatar
        :`/avatar/${data.profile_pic}`;

    return <img src={url} />;
}


/**
 * useUser hook
 * @param fetcher    useSWR fetcher
 */
function useUser(user) {
    const { data, error } = useSWR(`/api/user/getprofile?username=${user}`, fetchUser);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}
