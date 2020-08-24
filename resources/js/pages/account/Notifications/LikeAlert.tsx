import React from 'react';
import {Link} from 'react-router-dom';
import {AlertProp} from './alert-prop.d';
import {limit} from '../../../helpers/util';
import {howLong} from '../../../helpers/date-time';

import LazyDP from '../../../components/LazyDP';


const LikeAlert: React.FC<{data: AlertProp}> = ({data})=>{
    const d = data;

    return (
        <div className="row comment-alert">
            <div className="col col-2 dp-col">
                <span id='dp'>
                    <Link to={`/user/${d.associated_user}`}> <LazyDP user={d.associated_user} /> </Link>
                </span>
            </div>

            <div className="col col-fill notif-content">
                <span id='user'><Link to={`/user/${d.associated_user}`}> {d.associated_user} </Link></span>
                <span id='msg'>
                    {d.post_id!=null ?
                        <Link to={`/post/${d.post_id}`}> {d.message} </Link>
                        : limit(d.message, 127)
                    }
                </span>
                <span id='time'> {howLong(d.created_at)} </span>
            </div>
        </div>
    );
}

export default LikeAlert;
