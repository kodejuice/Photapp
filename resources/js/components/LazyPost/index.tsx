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

    const url = (isError || isLoading)
        ? default_image
        : JSON.parse(post.post_url)[0][1];
    /* post_url  json string -> "[[file_name, full_file_path], ...]"  */

    return <img src={url} />;
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
