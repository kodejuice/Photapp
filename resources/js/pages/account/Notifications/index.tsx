import React, {useEffect, useState, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import useSWR from '../../../helpers/swr';
import {mutate} from 'swr';
import minuteDifference from 'date-fns/differenceInMinutes';

import {NotificationProp} from './types.d';
import Header from '../../../components/Header';
import Spinner from '../../../components/Spinner';
import Splash from '../../../components/Splash';
import showAlert from '../../../components/Alert/showAlert';
import Suggestions from '../../../components/Suggestions';
import PageNotFound from '../../PageNotFound';

import authUser from '../../../state/auth_user';
import {fetchListing, markNotification, deleteNotifications} from '../../../helpers/fetcher';

import {checkForDeletion, sortNotifications, page_limit} from './helper';


import FollowAlert from './FollowAlert';
import MentionAlert from './MentionAlert';
import LikeAlert from './LikeAlert';
import CommentAlert from './CommentAlert';

import './style.scss';

const W = window as any;


const Notifications: React.FC<{}> = (props)=>{
    const {logged} = authUser();
    if (!logged && !(props as any).__JEST_TEST_ENV) return <PageNotFound />;

    const dispatch = useDispatch();
    const res = useNotification();

    if (res.data?.errors) {
        showAlert(dispatch, res.data.errors);
        res.data = null;
    }

    let alerts;
    if (res.data) {
        alerts = sortNotifications(res.data);
    }

    return (
        <React.Fragment>
            <Header page='activity' hide_icon={true} header_title='Activity' />

            <div className='notifications-body'>
                { res.isLoading ? <Spinner /> : ""}

                <div className='alerts'>
                    { alerts && alerts.length>0 && <ActionButtons data={alerts} _={res.data} /> }
                    { alerts && alerts.map((notif)=> <Notif key={notif.notification_id} data={notif} />) }
                </div>

                {res.data && (
                    <React.Fragment>
                        <span>{res.data.length<1 && <p id='note-msg'> Nothing here </p>}</span>
                        <div className="suggestions page disp-1 hide-big-screen" style={{paddingTop: '10px'}}>
                            <div className='row'>
                                <div className='col col-1 hide-screen-362'></div>
                                <p id='c-title' className='col col-fill'> Suggested For You </p>
                                <p id='see-more' className='col col-3 text-center'> <Link to="/explore/people">See All</Link> </p>
                            </div>
                            <div>
                                <Suggestions limit={10} />
                            </div>
                        </div>
                    </React.Fragment>
                )}

            </div>

        </React.Fragment>
    );
}


/**
 * Single Notification component
 *
 * Renders a single notification.
 */
function Notif({data}) {
    const {type} = data;

    // Notification already read before,
    // check if its due for deletion
    if (data.new == false) {
        checkForDeletion(data);
    }
    // mark this notification as read
    else if (data.new == true) {
        const mins = minuteDifference(
            new Date(),
            new Date(data.created_at)
        );

        // mark notification if notification is altleast
        // 10minutes old
        if (mins >= 10) {
            // TODO: uncomment this
            // markNotification(data.notification_id);
        }
    }

    if (type == 'like') {
        return <LikeAlert data={data} />;
    }
    else if (type == 'comment') {
        return <CommentAlert data={data} />;
    }
    else if (type == 'follow') {
        return <FollowAlert data={data} />;
    }
    else if (type == 'mention') {
        return <MentionAlert data={data} />;
    }

    return <React.Fragment> </React.Fragment>;
}


/**
 * mark|delete all
 */
const ActionButtons: React.FC<{
    data: NotificationProp[],
    _: NotificationProp[], // real alerts, no duplicates removed
}> = ({data, _})=>{
    const dispatch = useDispatch();
    const unmounted = useRef(false);

    const shown = Math.min(page_limit, data.length);
    const s = `${shown} notification${shown>1?'s':''}`;

    useEffect(()=>{
        unmounted.current = false;
        return ()=>{unmounted.current = true;};
    })

    const deleteAll = ()=>{
        if (!confirm(`Delete all ${s}`)) return;
        if (shown < page_limit && _.length) data = data.concat(_);

        let list = JSON.stringify(data.map(d => d.notification_id));

        deleteNotifications(list)
        .then(res=>{
            if (unmounted.current) return;
            if (res.errors) {
                showAlert(dispatch, res.errors);
                return;
            } else if (res.success) {
                mutate('/api/user/notifications');
                let more = (shown==page_limit ? ' loading more...' : '');
                showAlert(dispatch, ['Deleted!' + more], 'success');
            }
        })
    }

    return (
        <React.Fragment>
            <div className='action-btns'>
                <button onClick={deleteAll} className='action delete-all'>
                    Delete all
                </button>
            </div>
        </React.Fragment>
    );
}


/**
 * useNotification hook
 */
function useNotification() {
    const { data, error } = useSWR(`/api/user/notifications`, fetchListing);
    return {
        data,
        isLoading: !error && !data,
        isError: error
    }
}


export default Notifications;
