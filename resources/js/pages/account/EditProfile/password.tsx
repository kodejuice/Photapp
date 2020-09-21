import React from 'react';
import Header from './Header';

import {userProfile} from '../../../state/userProfile.d';

const Password: React.FC<{user:userProfile}> = ({user})=>{
    return (
        <Header page='password'>
            password
        </Header>
    );
};

export default Password;
