import React, {useState} from 'react';
import useSWR from 'swr';
import {fetchPost} from '../../helpers/fetcher';

const default_image = '/icon/camera.png';


/**
 * lazily/dynamically load first image of a users post
 * @param {number} props.post_id     post id
 */
export default function LazyPost({post_id}) {
    const {post, isLoading, isError} = usePost(post_id);

    // load default_image if post image url is invalid
    const onError = (ev: React.SyntheticEvent<HTMLImageElement>)=>{
        (ev.target as HTMLImageElement).src = default_image;
    };

    const url = (isError || isLoading || (!post?.post_url))
        ? default_image
        : JSON.parse(post.post_url)[0][1];
    /* post_url is a json string -> "[[file_name, full_file_path], ...]"  */

    return <img src={url} onError={onError} />;
}


/**
 * useUser hook
 * @param fetcher    useSWR fetcher
 */
function usePost(post_id: number) {
    const { data, error } = useSWR(`${post_id}`, fetchPost);
    return {
        post: data,
        isLoading: !error && !data,
        isError: error
    }
}
