import React, {useState, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {repostUserPost} from '../../helpers/fetcher';

import showAlert from '../Alert/showAlert';


type RepostButtonProps = {
    post_id: number,
    username: string,
}

const loading = <svg style={{margin: '0 auto', display: 'block', 'shapeRendering': 'auto'}} width="20px" height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> <circle cx="50" cy="50" fill="none" stroke="#93dbe9" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(176.644 50 50)"> <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform> </circle> </svg>

const RepostButton: React.FC<RepostButtonProps> = ({post_id, username}) => {
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState(false);
    const [reposted, setReposted] = useState(false);

    const unmounted = useRef<boolean>(false);
    useEffect(()=>{
        unmounted.current = false;
        return () => {unmounted.current = true;}
    });

    const isUnmounted = unmounted.current;

    const rePost = ()=>{
        if (!confirm(`Repost @${username}'s post?`)) return;
        setLoading(true);

        repostUserPost(post_id)
        .then(res => {
            if (isUnmounted) return;
            if (res?.errors) return showAlert(dispatch, res?.errors);
            if (!res?.success) return;
            showAlert(dispatch, ['Reposted!'], 'success');
            setReposted(true);
        })
        .catch(()=>{})
        .finally(()=>{
            if (isUnmounted) return;
            setLoading(false)
        });
    }

    return (
        <React.Fragment>
            {reposted && <span className='hidden' role='reposted'></span>}
            <button data-testid="repost-btn" role="repost-btn" onClick={rePost}> {isLoading ? loading : "Repost"} </button>
        </React.Fragment>
    );
}


export default RepostButton;
