import React from 'react';
import {Link} from 'react-router-dom';
import authUser from '../../state/auth_user';

import {limit} from '../../helpers/util';
import LazyDP from '../../components/LazyDP';
import FollowButton from '../../components/FollowButton';


const Users: React.FC<{data:any[],rdr?:boolean,show_full_name?:boolean}> = ({data, rdr, show_full_name})=>{
    const {user, logged} = authUser();

    return (
        <React.Fragment>
            <div className='users'>
                { data.map(({username, profile_pic, auth_user_follows, follows_auth_user, full_name})=> (
                    <div role='user' className='user row' key={username}>
                        <div className='col col-2'> <Link target={rdr ? 'blank' : ""} to={`/user/${username}`}><LazyDP user={username} /></Link> </div>
                        <div className='col col-fill'>
                            <div className='username'><Link target={rdr ? 'blank' : ""} to={`/user/${username}`}>{limit(username, 17)}</Link></div>
                            {show_full_name ? (
                                <div className='follow-info'>{limit(full_name, 20)}</div>
                            ) : (
                                <div className='follow-info'>{(logged && follows_auth_user) ? "Follows You" : limit(full_name, 20)}</div>
                            )}
                        </div>
                        <div className='col col-2 follow-col'>
                            {logged && username!=user.username && <FollowButton user={username} unfollow={auth_user_follows} />}
                        </div>
                    </div>
                )) }
            </div>
        </React.Fragment>
    );
}

export default Users;
