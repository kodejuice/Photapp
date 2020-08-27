import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import {NotificationProp} from './types.d';
import {limit} from '../../../helpers/util';
import {howLong} from '../../../helpers/date-time';

import LazyDP from '../../../components/LazyDP';
import LazyPost from '../../../components/LazyPost';


const LikeAlert: React.FC<{data: NotificationProp}> = ({data})=>{
    const d = data;
    const history = useHistory();

    return (
        <div className="row comment-alert" role="like-alert">
            <div className="col col-2 dp-col">
                <span id='dp'>
                    <Link to={`/user/${d.associated_user}`}> <LazyDP user={d.associated_user} /> </Link>
                </span>
            </div>

            <div className="col col-fill notif-content to-post row" onClick={_=>history.push(`/post/${d.post_id}`)}>
                <div className="col col-fill">
                    <span id='user'>
                        <a onClick={ev=>{ev.stopPropagation(); history.push(`/user/${d.associated_user}`)}}>
                            {d.associated_user+" "}
                        </a> 
                    </span>
                    <span id='msg'>
                        {d.post_id!=null ?
                            d.message
                            : limit(d.message, 127)
                        }
                    </span>
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

export default LikeAlert;
