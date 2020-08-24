import React from 'react';

type FollowButtonProps = {
    user: string,
    notification_id?: number|null
}

const FollowButton: React.FC<FollowButtonProps> = ({user, notification_id}) => {
    return (
        <button onClick={_=>followUser(user, notification_id)}> Follow </button>
    );
}


function followUser(user: string, notification_id?: number|null) {
    // TODO: follow user and set notification? as read
}

export default FollowButton;
