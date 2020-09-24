import React from 'react';

type RepostButtonProps = {
    post_id: number,
}

const load = <svg style={{margin: '0 auto', display: 'block', 'shapeRendering': 'auto'}} width="25px" height="25px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> <circle cx="50" cy="50" fill="none" stroke="#93dbe9" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(176.644 50 50)"> <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform> </circle> </svg>

const RepostButton: React.FC<RepostButtonProps> = ({post_id}) => {
    return (
        <button onClick={_=>rePost(post_id)}> Repost </button>
    );
}


function rePost(post_id: number) {
    // TODO: repost user post
}

export default RepostButton;
