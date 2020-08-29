import React from 'react';

type FollowButtonProps = {
    user: string,
    notification_id?: number|null,
    unfollow?: boolean,
}

const FollowButton: React.FC<FollowButtonProps> = ({user, notification_id, unfollow}) => {
    return (
        unfollow
        ?<button className='unfollow-button' onClick={_=>unfollowUser(user)}> Unfollow </button>
        :<button onClick={_=>followUser(user, notification_id)}> Follow </button>
    );
}


function unfollowUser(user: string) {
    // TODO: unfollow user
}

function followUser(user: string, notification_id?: number|null) {
    // TODO: follow user and set notification? as read
}

export default FollowButton;
