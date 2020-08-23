import React from 'react';
import {Link} from 'react-router-dom';
import {AlertProp} from './alert-prop.d';

import LazyDP from '../../../components/LazyDP';

const CommentAlert: React.FC<{data: AlertProp}> = ({data})=>{
    const d = data;

    return (
        <div className="row comment-alert">
            <div className="col col-2 dp-col">
                <span id='dp'> <LazyDP user={d.associated_user} /> </span>
            </div>

            <div className="col col-fill">
                <span id='user'><Link to={`/user/${d.associated_user}`}> {d.associated_user} </Link></span>
                <span id='msg'><Link to={`/post/${d.post_id}`}>commented on your post: {d.message}</Link></span>
                <span id='time'> 6w </span>
            </div>

        </div>
    );
}

export default CommentAlert;
