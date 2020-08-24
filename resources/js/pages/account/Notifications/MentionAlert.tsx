import React from 'react';
import {Link} from 'react-router-dom';
import {AlertProp} from './alert-prop.d';
import {limit} from '../../../helpers/util';
import {highlightMentions} from '../../../helpers/mini-components';

import {howLong} from '../../../helpers/date-time';

import LazyDP from '../../../components/LazyDP';
import LazyPost from '../../../components/LazyPost';
import FollowButton from '../../../components/FollowButton';


const MentionAlert: React.FC<{data: AlertProp}> = ({data})=>{
    const d = data;

    return (
        <div className="row comment-alert">
            <div className="col col-2 dp-col">
                <Link to={`/user/${d.associated_user}`}>
                    <span id='dp'> <LazyDP user={d.associated_user} /> </span>
                </Link>
            </div>

            <div className="col col-fill notif-content row">
                <div className="col col-fill">
                    <span id='user'><Link to={`/user/${d.associated_user}`}> {d.associated_user} </Link></span>
                    <span id='msg'>{highlightMentions(limit(d.message, 100))}</span>
                    <span id='time'> {howLong(d.created_at)} </span>
                </div>

                <div className="col col-3 follow_btn-col third-col">
                    <div className="post-img">
                        <Link to={`/post/${d.post_id}`}>
                            <LazyPost post_id={d.post_id} />
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default MentionAlert;
