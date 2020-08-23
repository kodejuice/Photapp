import React, {useRef, useState} from 'react';

import HeaderDesktop from './desktop';
import HeaderMobile from './mobile';

import './style.scss';


const Header: React.FC<{page: string}> = ({page}) => {


    return (
        <React.Fragment>

            <HeaderDesktop />

            <HeaderMobile current_page={page} />

        </React.Fragment>

  );

}

export default Header;
