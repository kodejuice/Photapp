import React, {useState, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {add_user_follow, delete_user_follow} from '../../state/actions';
import {RootState as Root} from '../../state/store';

import {followUser, unfollowUser, deleteNotification} from '../../helpers/fetcher';
import showAlert from '../Alert/showAlert';

type FollowButtonProps = {
    user: string,
    unfollow?: boolean,
    notification_id?: number,
    onFollow?: ()=>void,
    onUnfollow?: ()=>void,
    child?: React.ReactNode,
}

const loadingSmall = <svg className='load' style={{margin: '0 auto', display: 'block', 'shapeRendering': 'auto'}} width="13px" height="13px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> <circle cx="50" cy="50" fill="none" stroke="#93dbe9" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(176.644 50 50)"> <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform> </circle> </svg>
const loadingBig = <svg style={{margin: '0 auto', display: 'block', 'shapeRendering': 'auto'}} width="20px" height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> <circle cx="50" cy="50" fill="none" stroke="#93dbe9" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(176.644 50 50)"> <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform> </circle> </svg>


const FollowButton: React.FC<FollowButtonProps> = ({user, unfollow:_unfollow, notification_id, child, onFollow, onUnfollow}) => {
    const dispatch = useDispatch();
    const unmounted = useRef<boolean>(false);
    const {userFollow} = useSelector<Root,Root>(s => s);
    const [unfollow, setShouldUnfollow] = useState(_unfollow);
    const [isLoading, setLoading] = useState(false);

    useEffect(()=>{
        unmounted.current = false;
        return () => {unmounted.current = true;}
    });

    let isUnmounted = unmounted.current;

    const onButtonClick = (follow: boolean) => {
        setLoading(true);

        const response = follow ? followUser(user) : unfollowUser(user);
        response
        .then(res => {
            if (res?.errors) {
                if (res.errors[0] != 'Invalid action' && !isUnmounted) {
                    return showAlert(dispatch, res?.errors);
                }
            }
            if (!res?.success) return;

            try {
                dispatch(
                    follow
                    ? add_user_follow(user)
                    : delete_user_follow(user)
                );
            } catch (e) {}

            if (!isUnmounted) {
                setShouldUnfollow(follow);
            }

            // invoke callback
            if (follow && onFollow) onFollow();
            else if (!follow && onUnfollow) onUnfollow();

            // delete associated notification
            if (notification_id) {
                deleteNotification(notification_id);
            }
        })
        .catch(()=>{})
        .finally(()=>{
            if (isUnmounted) return;
            setLoading(false)
        });
    }

    return (
        unfollow || userFollow[user]

        ? <button role='unfollow-btn' data-testid='unfollow-btn' className='unfollow-button' onClick={_=>onButtonClick(false)}>
            {isLoading ? loadingBig : "Unfollow" }
        </button>

        : <button role='follow-btn' data-testid='follow-btn' onClick={_=>onButtonClick(true)}>
            {(isLoading && child)
                ? loadingSmall
                : (isLoading ? loadingBig : (child || "Follow"))}
        </button>

    );
}


export default FollowButton;
