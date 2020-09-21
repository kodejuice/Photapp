import React from 'react';
import Router from 'react-router';
import Header from '../../../components/Header';
import authUser from '../../../state/auth_user';
import {camel} from '../../../helpers/util';

import Profile from './profile';
import Notifications from './notifications';
import Password from './password';

import PageNotFound from '../../PageNotFound';

import "./style.scss";

const EditProfile: React.FC<Router.RouteComponentProps> = ({match})=>{
    const {logged, user} = authUser();
    if (!logged) return <PageNotFound />;

    const page = (match.params as any).page.toLowerCase();

    const components = {
        'profile': <Profile user={user}/>,
        'notifications': <Notifications user={user} />,
        'password': <Password user={user} />,
    };

    if (page in components) {
        const title = {
            'profile': 'Edit Profile',
            'password': "Change Password",
            'notifications': "Notifications",
        }[page];

        return (
            <React.Fragment>
                <Header page='profile' hide_icon={true} header_title={title}/>
                {components[page]}
            </React.Fragment>
        );
    }

    return <PageNotFound />;
}

export default EditProfile;
