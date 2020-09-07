import React from 'react';
import {Link} from 'react-router-dom';
import authUser from '../../state/auth_user';

import LazyDP from '../../components/LazyDP';
import FollowButton from '../../components/FollowButton';


const Users: React.FC<{data:any[]}> = ({data})=>{
    const {user, logged} = authUser();

    // remove logged user
    if (data) {
        data = data.filter(x => x.username != user?.username);
    }

    return (
        <React.Fragment>
            <div className='users'>
                { data.map(({username, profile_pic, auth_user_follows, follows_auth_user, full_name})=> (
                    <div role='user' className='user row' key={username}>
                        <div className='col col-2'> <Link to={`/user/${username}`}><LazyDP user={username} /></Link> </div>
                        <div className='col col-fill'>
                            <div className='username'><Link to={`/user/${username}`}>{username}</Link></div>
                            <div className='follow-info'>{(logged && follows_auth_user) ? "Follows You" : full_name}</div>
                        </div>
                        <div className='col col-2 follow-col'> <FollowButton user={username} unfollow={auth_user_follows} /> </div>
                    </div>
                )) }
            </div>
        </React.Fragment>
    );
}

export default Users;
