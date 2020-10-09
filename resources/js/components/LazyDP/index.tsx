import React, {useState} from 'react';
import useSWR from '../../helpers/swr';
import {fetchUser} from '../../helpers/fetcher';
import {waiting, avatarIcon as default_avatar} from '../../helpers/mini-components';

/**
 * lazily/dynamically load user profile picture
 * @param {string} props.user     username
 */
export default function LazyDP({user}) {
    const {data, isLoading, isError} = useUser(user);

    // load default_avatar if dp image url is invalid
    const onError = (ev: React.SyntheticEvent<HTMLImageElement>)=>{
        const img = (ev.target as HTMLImageElement);
        if (img.src != default_avatar) {
            img.src = default_avatar;
        }
    };

    const url = (isError || isLoading || (!data?.profile_pic))
        ? default_avatar
        :`${data.profile_pic}`;

    return <img role={data?'dp':''} data-testid="dp" src={isLoading ? waiting : url} onError={onError} />;
}


/**
 * display user profile pic
 * present in the user object
 * @param {[type]} options.user_object [description]
 */
export function LazyDPSync(props) {
    const data = props?.data,
          isLoading = props?.loading;

    // load default_avatar if dp image url is invalid
    const onError = (ev: React.SyntheticEvent<HTMLImageElement>)=>{
        const img = (ev.target as HTMLImageElement);
        if (img.src != default_avatar) {
            img.src = default_avatar;
        }
    };

    const url = (!data?.profile_pic)
        ? default_avatar
        :`${data.profile_pic}`;

    return <img role={data?'dp':''} src={isLoading ? waiting : url} onError={onError} />;
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
