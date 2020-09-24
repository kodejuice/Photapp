import React from 'react';
import {useDispatch} from 'react-redux';
import Router from 'react-router';
import useSWR,{W} from '../../helpers/swr';
import authUser from '../../state/auth_user';
import {fetchPost} from '../../helpers/fetcher';

import Header from '../../components/Header';
import Spinner from '../../components/Spinner';
import showAlert from '../../components/Alert/showAlert';

import {post_get} from '../../helpers/util';

import Post from './Post';
import "../styles/Post.scss";


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
            <Header page="/" header_title="Post" hide_icon={true} />
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
                        {post && "post info"}
                    </div>
                </div>

            </div>
        </React.Fragment>
    );
}



/**
 * usePost hook
 * @param  {number} post_id  id of post
 */
function usePost(post_id: number) {
    // store post data in swr map upfront before
    // making request with SWR, thats if we have the post already
    // in the post cache
    const post_from_cache = post_get(post_id);
    if (post_from_cache) {
        W.__SWR_MAP__.set(`${post_id}fetchPost`, post_from_cache);
    }

    const {data, error} = useSWR(`${post_id}`, fetchPost);
    return {
        post: data,
        isLoading: !error && !data,
    };
}

export default PostPage;
