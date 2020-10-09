import React from 'react';
import {Link} from 'react-router-dom';
import authUser from '../../state/auth_user';

import {limit} from '../../helpers/util';
import LazyDP from '../../components/LazyDP';
import FollowButton from '../../components/FollowButton';


/**
 * single user component
 *
 */
const SingleUser: React.FC<{user: any, rdr: boolean, show_name: boolean, mutate: Function}> = ({user, rdr, show_name, mutate})=>{
    const {user: auth_user, logged} = authUser();
    const {username, profile_pic, auth_user_follows, follows_auth_user, full_name} = user;

    const revalidate = ()=>{
        // re-validate SWR, 
        mutate();
    };

    return (
        <div role='user' className='user row' key={username}>
            <div className='col col-2'> <Link target={rdr ? 'blank' : ""} to={`/user/${username}`}><LazyDP user={username} /></Link> </div>
            <div className='col col-fill'>
                <div className='username'><Link target={rdr ? 'blank' : ""} to={`/user/${username}`}>{limit(username, 17)}</Link></div>
                {show_name ? (
                    <div className='follow-info'>{limit(full_name, 20)}</div>
                ) : (
                    <div className='follow-info'>{(logged && follows_auth_user) ? "Follows You" : limit(full_name, 20)}</div>
                )}
            </div>
            <div className='col col-2 follow-col'>
                {logged && username != auth_user.username && (
                    <FollowButton
                        user={username}
                        unfollow={auth_user_follows}
                        onFollow={()=>revalidate()}
                        onUnfollow={()=>revalidate()}
                    />
                )}
            </div>
        </div>
    );
}


function removeDuplicate(users) {
    if (!Array.isArray(users)) return users;
    let seen = new Set();
    let clean: typeof users = [];
    for (let i=0; i<users.length; ++i) {
        let {username} = users[i];
        if (seen.has(username)) continue;
        clean.push(users[i]);
        seen.add(username);
    }
    return clean;
}

/**
 * Users component
 * @type {React.FC<...>}
 */
const Users: React.FC<{
    data: any[],
    mutate: Function,
    rdr?: boolean,
    show_full_name?: boolean
}> = ({data, rdr, show_full_name, mutate})=>{
    return (
        <React.Fragment>
            <div className='users'>
                { removeDuplicate(data).map((user, i)=> (
                    <SingleUser key={user.username} rdr={!!rdr} show_name={!!show_full_name} user={user} mutate={mutate} />
                )) }
            </div>
        </React.Fragment>
    );
}

export default Users;
