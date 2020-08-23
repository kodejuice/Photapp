import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import useSWR from 'swr';

import Header from '../../../components/Header';
import Spinner from '../../../components/Spinner';
import Splash from '../../../components/Splash';

import authUser from '../../../helpers/auth_user';
import {fetchListing} from '../../../helpers/fetcher';

import FollowAlert from './FollowAlert';
import MentionAlert from './MentionAlert';
import LikeAlert from './LikeAlert';
import CommentAlert from './CommentAlert';

import './style.scss';


const Notifications: React.FC<{}> = ()=>{
    const {logged} = authUser();
    const [mounted, setMounted] = useState(false);
    const history = useHistory();

    // redirect to login page if not logged in
    if (!logged) {
        (window as any).location = "/login";
        return <Splash color='bw' />;
    }

    const res = useNotification(fetchListing);

    if (res.data?.errors) {
        res.isError = res.data.errors[0];
        res.data = null;
    }

    return (
        <React.Fragment>
            <Header page='activity' hide_icon={true} header_title='Activity' />

            <div className='notifications-body'>
                { res.isLoading ? <Spinner /> : ""}
                { res.isError ? <em id='err'> {res.isError} </em> : "" }

                <div className='alerts'>
                    { res.data ? res.data.map((notif)=> <Notif key={notif.notification_id} data={notif} />) : "" }
                </div>
            </div>

        </React.Fragment>
    );
}


/**
 * Single Notification component
 */
function Notif({data}) {
    const {type} = data;

    if (type == 'like') {
        return <LikeAlert data={data} />
    }
    else if (type == 'comment') {
        return <CommentAlert data={data} />;
    }
    else if (type == 'follow') {
        return <FollowAlert data={data} />
    }
    else if (type == 'mention') {
        return <MentionAlert data={data} />
    }

    return <React.Fragment> </React.Fragment>;
}



/**
 * useNotification hook
 * @param fetcher    useSWR fetcher
 */
function useNotification(fetcher) {
    const { data, error } = useSWR(`/api/user/notifications`, fetcher);
    return {
        data: data,
        isLoading: !error && !data,
        isError: error
    }
}


export default Notifications;
