import React from 'react';
import Header from './Header';

const Profile: React.FC<{}> = ()=>{
import {userProfile} from '../../../state/userProfile.d';
const Profile: React.FC<{user: userProfile}> = ({user})=>{
    return (
        <Header page='profile'>
            hello
        </Header>
    );
};

export default Profile;
