import React from 'react';
import { Link } from "react-router-dom";
import {useSelector} from 'react-redux';
import authUser from '../../state/auth_user';

type HeaderProps = {
    header_title?: string,
    hide_icon?: boolean,
    current_page: string
};

// floating `add photo` btn

const Header: React.FC<HeaderProps> = ({header_title, hide_icon, current_page})=>{
    const {user} = authUser();

    return (
        <header className='hide-desktop'>
            <div className='fixed-wrapper'>
                <nav className="header border">
                    {!hide_icon?
                    <div className="photo-btn">
                        <img src="/favicon/favicon.ico"/>
                    </div>
                    :""}

                    {!header_title?
                    <Link to="/"><h1 className='header-title bg-logo'> </h1></Link>
                    : <div className='header-title'> {header_title} </div> }
                </nav>
            </div>

            <footer className='border footer'>
                <div className="row btns">
                    <div className="col col-fill btn" id={`curr-${current_page=='/'}`}>
                        <Link to="/"> <img src="/icon/home.png"/> </Link>
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='explore'}`}>
                        <Link to="/explore"> <img src="/icon/search.svg"/> </Link>
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='add'}`}>
                        <img src="/icon/add.svg"/>
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='activity'}`}>
                        <Link to={user?.id ? "/activity": "/login"}> <img src="/icon/heart.png"/> </Link>
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='profile'}`}>
                        {
                            user?.id ?
                                <Link to={`/user/${user.username}`}>
                                    <img className='avatar' src={user.profile_pic ? `/avatar/${user.profile_pic}` : '/icon/avatar.png'} />
                                </Link>
                                :
                                <Link to="/login"><img src="/icon/login.png"/> </Link>                                
                        }
                    </div>
                </div>
            </footer>
        </header>
    );
}


export default Header;