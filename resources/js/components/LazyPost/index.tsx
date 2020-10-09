import React, {useState} from 'react';
import useSWR from '../../helpers/swr';
import {fetchPost} from '../../helpers/fetcher';
import {waiting} from '../../helpers/mini-components';

const default_image = '/icon/camera.png';

/**
 * lazily/dynamically load first image of a users post
 * @param {number} props.post_id     post id
 */
export default function LazyPost({post_id}) {
    const {post, isLoading, isError} = usePost(post_id);

    // load default_image if post image url is invalid
    const onError = (ev: React.SyntheticEvent<HTMLImageElement>)=>{
        const img = (ev.target as HTMLImageElement);
        if (img.src != default_image) {
            img.src = default_image;
        }
    };

    const url = (isError || isLoading || (!post?.post_url))
        ? default_image
        : getImageInPost(post);

    return <img role={post?'post-img':''} data-testid='post-img' src={isLoading ? waiting : url} onError={onError} />;
}


/**
 * Gets the first image in a post.
 *
 * @param      {<Post object>}  post
 */
function getImageInPost(post) {
    const media_types = JSON.parse(post.media_type);
    // post.media_type is a JSON string -> "['image', 'video', ...]"
    
    const posts = JSON.parse(post.post_url);
    /* post.post_url is a JSON string -> "[[file_name, full_file_path], ...]"  */

    for (let i=0; i<media_types.length; ++i) {
        if (media_types[i] == 'image') {
            return posts[i][1];
        }
    }

    return default_image;
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
