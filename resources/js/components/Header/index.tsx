import React, {useRef, useState} from 'react';

import HeaderDesktop from './desktop';
import HeaderMobile from './mobile';

import './style.scss';


const Header: React.FC<{}> = () => {


    return (
        <React.Fragment>

            <HeaderDesktop />

            <HeaderMobile />

        </React.Fragment>

  );

}

export default Header;
