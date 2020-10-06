import React from 'react';
import {Link} from 'react-router-dom';
import {mutate} from 'swr';
import {NotificationProp} from './types.d';
import {limit} from '../../../helpers/util';
import {howLong} from '../../../helpers/date-time';

import LazyDP from '../../../components/LazyDP';
import FollowButton from '../../../components/FollowButton';


const FollowAlert: React.FC<{data: NotificationProp}> = ({data})=>{
    const d = data;

    return (
        <div className="row comment-alert" role="follow-alert">
            <div className="col col-2 dp-col">
                <Link to={`/user/${d.associated_user}`}>
                    <span id='dp'> <LazyDP user={d.associated_user} /> </span>
                </Link>
            </div>

            <div className="col col-fill notif-content row">
                <div className="col col-fill">
                    <span id='user'><Link to={`/user/${d.associated_user}`}> {d.associated_user} </Link></span>
                    <div>
                        <span id='msg'>{d.message}</span>
                        <span id='time'> {howLong(d.created_at)} </span>
                    </div>
                </div>

                <div className="col col-3 follow_btn-col">
                    <FollowButton
                        unfollow={d.auth_user_follows}
                        notification_id={d.notification_id}
                        user={d.associated_user}
                        onFollow={()=>mutate('/api/user/notifications')}
                        onUnfollow={()=>mutate('/api/user/notifications')}
                    />
                </div>
            </div>

        </div>
    );
}

export default FollowAlert;
