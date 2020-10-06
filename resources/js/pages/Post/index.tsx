import React from 'react';
import {useDispatch} from 'react-redux';
import Router from 'react-router';
import useSWR,{W} from '../../helpers/swr';
import authUser from '../../state/auth_user';
import {fetchPost} from '../../helpers/fetcher';

import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import showAlert from '../../components/Alert/showAlert';

import {post_get, camel} from '../../helpers/util';

import Post from './Post';
import MorePosts from './MorePosts';
import PostInfo from './PostInfo';
import "./style.scss";


const PostPage: React.FC<Router.RouteComponentProps> = ({match})=>{
    const dispatch = useDispatch();
    const id = ((match.params as any).id);
    let {post, isLoading} = usePost(id);
    const auth_user = authUser();

    if (post?.errors) {
        showAlert(dispatch, post.errors, 'error', 20);
        post = null;
    }

    return (
        <React.Fragment>
            <Header page="/" header_title={headerTitle(post)} hide_icon={true} />
            {isLoading && <div style={{marginTop:'40px'}}><Spinner /></div>}
            <div className='post-page'>

                <div className='row'>
                    <div className='post-media'>
                        {post && <Post
                            post={post}
                            auth_user={auth_user}
                        />}
                    </div>

                    <div className='post-data' id='comments'>
                        {post && <PostInfo
                            post={post}
                            auth_user={auth_user}
                        />}
                    </div>
                </div>

                {post && <div className='row more-posts'>
                    <MorePosts user={post.username} exclude={post.post_id} />
                </div>}

            </div>
        </React.Fragment>
    );
}


function headerTitle(post) {
    if (!post || typeof post?.media_type != 'string') {
        return "Post";
    }
    const media_types = JSON.parse(post.media_type);
    if (media_types.length > 1) {
        return "Post";
    }
    return camel(media_types[0] == 'image' ? 'photo' : media_types[0]);
}


/**
 * usePost hook
 * @param  {number} post_id  id of post
 */
export function usePost(post_id: number) {
    // store post data in swr map upfront before
    // making request with SWR, thats if we have the post already
    // in the post cache
    const post_from_cache = post_get(post_id);
    if (post_from_cache) {
        W.__SWR_MAP__.set(`${post_id}fetchPost`, post_from_cache);
    }

    const {data, error, mutate} = useSWR(`${post_id}`, fetchPost);
    return {
        post: data,
        mutate,
        isLoading: !error && !data,
    };
}

export default PostPage;
