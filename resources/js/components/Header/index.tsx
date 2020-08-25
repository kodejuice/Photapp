import React, {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../state/store';

import HeaderDesktop from './desktop';
import HeaderMobile from './mobile';

import Alert from '../Alert';
import showAlert from '../Alert/showAlert';

import {useDispatch} from 'react-redux';

import './style.scss';


type HeaderProps = {
    header_title?: string,
    hide_icon?: boolean,
    page: string
};

type AlertProps = {
    message: string[],
    type: 'error' | 'success'
};


const Header: React.FC<HeaderProps> = ({page, hide_icon, header_title}) => {
    const {message, type} = useSelector<RootState, AlertProps>(({alert}) => alert);
    const dispatch = useDispatch();

    return (
        <React.Fragment>

            <Alert message={message} type={type} />

            <HeaderDesktop />

            <HeaderMobile current_page={page} header_title={header_title} hide_icon={hide_icon} />

        </React.Fragment>
  );

}

export default Header;
