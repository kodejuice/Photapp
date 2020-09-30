import React from 'react';
import {Link} from 'react-router-dom';
import useSWR from '../../helpers/swr';
import Spinner from '../../components/Spinner';
import Posts from '../../components/Posts';
import {fetchListing} from '../../helpers/fetcher';

export default function MorePosts({exclude, user}) {
    let {posts, isLoading} = usePosts({exclude, user});
    if (posts?.errors) {
        posts = null;
    }

    return (
        <React.Fragment>
            {posts && posts.length>0 && (
                <div className='title' role='more-posts-title'>
                    More posts from <Link to={`/user/${user}`}>{user}</Link>
                </div>
            )}
            {isLoading && <div style={{marginTop:'40px', width: '100%'}}><Spinner type='list' /></div>}
            {posts && <Posts view='tile' data={posts.slice(0,6)} />}
        </React.Fragment>
    );
}

/**
 * usePosts hook, 
 * fetches posts from db w/ SWR
 */
function usePosts({exclude, user}) {
    let { data, error } = useSWR(`/api/user/${user}/posts?limit=7`, fetchListing);

    if (data && Array.isArray(data)) {
        data = data && data.filter(post => post.post_id != exclude);
    }

    return {
        posts: data,
        isLoading: !error && !data,
    }
}
