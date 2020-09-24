import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import FollowButton from '../../components/FollowButton';
import RepostButton from '../../components/RepostButton';
import LazyDP from '../../components/LazyDP';

import MediaViewer from '../../components/Posts/HomeView/MediaViewer';
import {copyToClipboard, deletePost} from '../../components/Posts/HomeView/helper';


export default function Post({post, auth_user}) {
    const dispatch = useDispatch();
    const {user, logged} = auth_user;

    return (
        <div className="card">

            {/* <Post modal> */}
            <input className="modal-state" id={`modal-post`} type="checkbox"/>
            <div className="modal">
               <label className="modal-bg" htmlFor={`modal-post`}></label>
               <div className="modal-body">
                   {logged && (post.username != user.username
                       ? <FollowButton user={post.username} unfollow={post.auth_user_follows} />
                       : <button onClick={()=>deletePost(post.post_id)} className='delete-post'> Delete post </button>
                   )}
                   <button onClick={()=>copyToClipboard(`${location.host}/post/${post.post_id}`, dispatch)}> Copy link </button>
                   <RepostButton post_id={post.post_id} />
                   <label htmlFor={`modal-post`}> Cancel </label>
               </div>
            </div>
           {/* </Post modal> */}

           <div className="card-header">
               <div className='row post-info'>
                   <div className='col col-1'> <div className='user-dp'> <Link to={`/user/${post.username}`}> <LazyDP user={post.username} /> </Link>  </div> </div>
                   <div className='col col-fill'> <div className='user-name'> <Link to={`/user/${post.username}`}> {post.username} </Link> </div> </div>
                   <label htmlFor={`modal-post`}> <div className='col col-1'> <div className='user-opt'> <svg aria-label="More options" fill="#262626" height="16" viewBox="0 0 48 48" width="16"><circle clipRule="evenodd" cx="8" cy="24" fillRule="evenodd" r="4.5"></circle><circle clipRule="evenodd" cx="24" cy="24" fillRule="evenodd" r="4.5"></circle><circle clipRule="evenodd" cx="40" cy="24" fillRule="evenodd" r="4.5"></circle></svg> </div> </div> </label>
               </div>
           </div>

           <div className="card-post">
               <div>
                   <MediaViewer
                       paths={JSON.parse(post.post_url)}
                       media_types={JSON.parse(post.media_type)}
                   />
               </div>
           </div>

        </div>
    );
}
