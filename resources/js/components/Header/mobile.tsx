import React from 'react';
import { Link } from "react-router-dom";
import {useSelector} from 'react-redux';
import authUser from '../../state/auth_user';
import {AlertIndicator, backIcon, homeIcon, searchIcon, addIcon, heartIcon_64 as heartIcon, loginIcon, avatarIcon} from '../../helpers/mini-components';
import {openFileDialog} from '../../components/AddPost/helper';
import {limit} from '../../helpers/util';

type HeaderProps = {
    header_title?: string,
    hide_icon?: boolean,
    current_page: string
};


const Header: React.FC<HeaderProps> = ({header_title, hide_icon, current_page})=>{
    const {user, logged} = authUser();

    return (
        <header className='hide-desktop'>
            <div className='fixed-wrapper'>
                <nav className="header border">
                    {!hide_icon?(
                        <div className="photo-btn">
                            <label htmlFor="modal-addpost">
                                <img src="/favicon/favicon.ico"/>
                            </label>
                        </div>)
                    :(
                        <div className="photo-btn">
                            <img id='go_back' src={backIcon} onClick={()=>history.back()} />
                        </div>
                    )}

                    {!header_title?
                    <Link to="/"><h1 className='header-title bg-logo'> </h1></Link>
                    : <div className='header-title'> {limit(header_title, 19)} </div> }
                </nav>
            </div>

            <footer className='border footer'>
                <div className="row btns">
                    <div className="col col-fill btn" id={`curr-${current_page=='/'}`}>
                        <Link to="/"> <img src={homeIcon}/> </Link>
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='explore'}`}>
                        <Link to="/explore"> <img src={searchIcon}/> </Link>
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='add'}`}>
                        <label htmlFor='modal-addpost' onClick={()=>openFileDialog()}>
                            <img src={addIcon}/>
                        </label>
                    </div>
                     <div className="col col-fill btn notif" id={`curr-${current_page=='activity'}`}>
                        <Link to={logged ? "/activity": "#"}> <img src={heartIcon}/> </Link>
                        {logged && <AlertIndicator />}
                    </div>
                    <div className="col col-fill btn" id={`curr-${current_page=='profile'}`}>
                        {
                            user?.id ?
                                <Link to={`/user/${user.username}`}>
                                    <img className='avatar' src={user.profile_pic ? `${user.profile_pic}` : avatarIcon} />
                                </Link>
                                :
                                <Link to="/login"><img src={loginIcon}/> </Link>                                
                        }
                    </div>
                </div>
            </footer>
        </header>
    );
}


export default Header;
