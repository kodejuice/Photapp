import React from 'react';
import Header from './Header';

import {userProfile} from '../../../state/userProfile.d';

const Notifications: React.FC<{user: userProfile}> = ({user})=>{
    return (
        <Header page='notifications'>
            notif!
        </Header>
    );
};

export default Notifications;
