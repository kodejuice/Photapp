import React from 'react';

type FollowButtonProps = {
    user: string,
    notification_id?: number|null,
    unfollow?: boolean,
    child?: React.ReactNode,
}

const loadSmall = <svg className='load' style={{margin: '0 auto', display: 'block', 'shapeRendering': 'auto'}} width="13px" height="13px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> <circle cx="50" cy="50" fill="none" stroke="#93dbe9" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(176.644 50 50)"> <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform> </circle> </svg>
const load = <svg style={{margin: '0 auto', display: 'block', 'shapeRendering': 'auto'}} width="25px" height="25px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> <circle cx="50" cy="50" fill="none" stroke="#93dbe9" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(176.644 50 50)"> <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform> </circle> </svg>

const FollowButton: React.FC<FollowButtonProps> = ({user, notification_id, unfollow, child}) => {
    return (
        unfollow
        ?<button className='unfollow-button' onClick={_=>unfollowUser(user)}> Unfollow </button>
        :<button onClick={_=>followUser(user, notification_id)}> {child || "Follow"} </button>
    );
}


function unfollowUser(user: string) {
    // TODO: unfollow user
}

function followUser(user: string, notification_id?: number|null) {
    // TODO: follow user and set notification? as read
}

export default FollowButton;
