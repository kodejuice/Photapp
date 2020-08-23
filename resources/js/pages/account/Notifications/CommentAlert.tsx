import React from 'react';
import {Link} from 'react-router-dom';
import {AlertProp} from './alert-prop.d';

import LazyDP from '../../../components/LazyDP';


/**
 * limit string
 * @param  {string} str        string
 * @param  {string} lim        limit
 * @return {string}
 */
const limit = (str: string, lim: number): string => str.length > lim ? `${str.substr(0, lim)}...` : str;


const CommentAlert: React.FC<{data: AlertProp}> = ({data})=>{
    const d = data;

    return (
        <div className="row comment-alert">
            <div className="col col-2 dp-col">
                <Link to={`/user/${d.associated_user}`}>
                    <span id='dp'> <LazyDP user={d.associated_user} /> </span>
                </Link>
            </div>

            <div className="col col-fill notif-content">
                <span id='user'><Link to={`/user/${d.associated_user}`}> {d.associated_user} </Link></span>
                <span id='msg'><Link to={`/post/${d.post_id}`}>commented on your post: {limit(d.message, 127)} </Link></span>
                <span id='time'> 6w </span>
            </div>
        </div>
    );
}

export default CommentAlert;
