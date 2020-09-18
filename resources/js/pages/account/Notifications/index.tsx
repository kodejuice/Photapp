import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import useSWR from '../../../helpers/swr';

import Header from '../../../components/Header';
import Spinner from '../../../components/Spinner';
import Splash from '../../../components/Splash';
import showAlert from '../../../components/Alert/showAlert';
import Suggestions from '../../../components/Suggestions';
import PageNotFound from '../../PageNotFound';

import authUser from '../../../state/auth_user';
import {fetchListing, markNotification} from '../../../helpers/fetcher';

import {checkForDeletion} from './helper';


import FollowAlert from './FollowAlert';
import MentionAlert from './MentionAlert';
import LikeAlert from './LikeAlert';
import CommentAlert from './CommentAlert';

import './style.scss';


const Notifications: React.FC<{}> = ()=>{
    const {logged} = authUser();
    if (!logged) return <PageNotFound />;

    const dispatch = useDispatch();
    const res = useNotification();

    if (res.data?.errors) {
        showAlert(dispatch, res.data.errors);
        res.data = null;
    }

    return (
        <React.Fragment>
            <Header page='activity' hide_icon={true} header_title='Activity' />

            <div className='notifications-body'>
                { res.isLoading ? <Spinner /> : ""}

                <div className='alerts'>
                    { res.data ? res.data.map((notif)=> <Notif key={notif.notification_id} data={notif} />) : "" }
                </div>

                {res.data && (
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
    if (type != 'follow' && data.new == true) {
        markNotification(data.notification_id);
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
 * useNotification hook
 */
function useNotification() {
    const { data, error } = useSWR(`/api/user/notifications`, fetchListing);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}


export default Notifications;
