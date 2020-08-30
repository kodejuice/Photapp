import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {NotificationProp} from './types.d';
import {limit} from '../../../helpers/util';
import {ProcessUserInput} from '../../../helpers/mini-components';

import {howLong} from '../../../helpers/date-time';

import LazyDP from '../../../components/LazyDP';
import LazyPost from '../../../components/LazyPost';
import FollowButton from '../../../components/FollowButton';


const MentionAlert: React.FC<{data: NotificationProp}> = ({data})=>{
    const d = data;
    const history = useHistory();

    return (
        <div className="row comment-alert" role="mention-alert">
            <div className="col col-2 dp-col">
                <Link to={`/user/${d.associated_user}`}>
                    <span id='dp'> <LazyDP user={d.associated_user} /> </span>
                </Link>
            </div>

            <div className="col col-fill notif-content row to-post" onClick={_=>history.push(`/post/${d.post_id}`)}>
                <div className="col col-fill">
                    <span id='user'>
                        <a onClick={ev=>{ev.stopPropagation(); history.push(`/user/${d.associated_user}`)}}>
                            {d.associated_user+" "}
                        </a>
                    </span>
                    <span id='msg'><ProcessUserInput text={limit(d.message, 100)} /></span>
                    <span id='time'> {howLong(d.created_at)} </span>
                </div>

                <div className="col col-3 third-col">
                    <div className="post-img">
                        <LazyPost post_id={d.post_id} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default MentionAlert;
