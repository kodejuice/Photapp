import React, {useRef, useState} from 'react';

import HeaderDesktop from './desktop';
import HeaderMobile from './mobile';

import './style.scss';


type HeaderProps = {
    header_title?: string,
    hide_icon?: boolean,
    page: string
};


const Header: React.FC<HeaderProps> = ({page, hide_icon, header_title}) => {
    return (
        <React.Fragment>

            <HeaderDesktop />

            <HeaderMobile current_page={page} header_title={header_title} hide_icon={hide_icon} />

        </React.Fragment>
  );

}

export default Header;
