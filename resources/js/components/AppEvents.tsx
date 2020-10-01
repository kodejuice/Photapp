import React, {useRef, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import authUser from '../state/auth_user';
import {set_notification} from '../state/actions';

import useSWR from 'swr';
import {fetchListing} from '../helpers/fetcher';

const {Echo} = (window as any);

/**
 * Component that listens
 * for events broadcasted by laravel
 */

const AppEvents: React.FC<{}> = () => {
    const {logged, user} = authUser();
    if (!logged) return null;

    const dispatch = useDispatch();
    const ref = useRef<boolean|null>(false);
    const {notifications} = useNotifications();

    const notifyUser = (notify: boolean)=>{
        if (ref.current == null) return; // unmounted

        dispatch(set_notification(notify));
    }

    if (notifications) {
        notifyUser(
            notifications.some(n => +n.new == 1)
        );
    }


    useEffect(()=>{
        if (!ref.current) {
            const channels = ['comment.${id}', 'post.${id}', 'mention.${id}', 'follow.${id}'];
            const events = ['CommentAction', 'PostAction', 'UserMentioned', 'UserFollowed'];

            // listen for Laravel Echo broadcast
            channels.forEach((c, i)=>{
                Echo.private(c)
                    .listen(events[i], (e) => {
                        notifyUser(true);
                    });
            });
            ref.current = true;
        }
        return ()=>{ref.current = null;};
    });

    return null;
}


/**
 * useNotifications hook
 */
function useNotifications() {
    const { data } = useSWR(`/api/user/notifications`, fetchListing);
    return {
        notifications: data,
    }
}

export default AppEvents;
