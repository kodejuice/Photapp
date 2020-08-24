import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {AlertProp} from './alert-prop.d';
import {limit} from '../../../helpers/util';
import {highlightMentions} from '../../../helpers/mini-components';

import {howLong} from '../../../helpers/date-time';

import LazyDP from '../../../components/LazyDP';


const CommentAlert: React.FC<{data: AlertProp}> = ({data})=>{
    const history = useHistory();
    const d = data;

    return (
        <div className="row comment-alert">
            <div className="col col-2 dp-col">
                <Link to={`/user/${d.associated_user}`}>
                    <span id='dp'> <LazyDP user={d.associated_user} /> </span>
                </Link>
            </div>

            <div className="col col-fill notif-content to-post" onClick={_=>history.push(`/post/${d.post_id}`)}>
                <span id='user'><Link to={`/user/${d.associated_user}`}> {d.associated_user} </Link></span>
                <span id='msg'>commented on your post: {highlightMentions(limit(d.message, 127))} </span>
                <span id='time'> {howLong(d.created_at)} </span>
            </div>
        </div>
    );
}

export default CommentAlert;
