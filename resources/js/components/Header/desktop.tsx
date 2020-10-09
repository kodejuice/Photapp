import React, {useRef, useState, useEffect} from 'react';
import { useHistory, Link } from "react-router-dom";

import {AlertIndicator, homeIcon, heartIcon_64 as heartIcon, loginIcon, avatarIcon, exploreIcon} from '../../helpers/mini-components';
import {openFileDialog} from '../../components/AddPost/helper';
import {logUserOut} from '../../helpers/fetcher';
import authUser from '../../state/auth_user';

const Header: React.FC<{}> = ()=>{
    const ref = useRef(null);
    const history = useHistory();

    const [dropdown_shown, showDropdown] = useState(false) ;
    const {user, logged} = authUser();

    const toggleDropdown = ()=>{
        showDropdown(!dropdown_shown);

        // hide dropdown in 7 seconds
        // if this component is still mounted
        setTimeout((reverse)=>{
            if (ref.current != null) showDropdown(false);
        }, 7000, dropdown_shown);
    }

    return (
        <header className='hide-mobile'>
            <nav className="header border fixed">
                <div className="header-wrapper row">
                    <div className="header-brand col-3 col">
                        <Link to="/"><h1 className="bg-logo"> </h1></Link>
                    </div>
                    <div className="search-bar col-3 col hide-width-814">
                        <div className='search-input-wrap'>
                            <form onSubmit={_=>onSearch(_, ref.current, history)}>
                                <input ref={ref} type='search' placeholder='Search' name='search' />
                            </form>
                        </div>
                    </div>
                    <div className="nav-links col-fill col">
                        <ul className="inline">
                            <li><Link to="/"><img src={homeIcon}/></Link></li>
                            <li><Link to="/explore"><img src={exploreIcon}/></Link></li>
                            {
                                !logged ?
                                    <React.Fragment>
                                        <li title="Login"> <Link to="/login"><img src={loginIcon}/></Link> </li>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <li id='notif'>
                                            <Link to="/activity"><img src={heartIcon}/></Link>
                                            {user?.id && <AlertIndicator />}
                                        </li>
                                        <li>
                                            <div className="dropdown">
                                                <img onClick={_=>toggleDropdown()}
                                                     className='dropbtn avatar'
                                                     src={user.profile_pic ? `${user.profile_pic}` : avatarIcon}
                                                />
                                                <div className={`dropdown-content ${dropdown_shown?'show':''}`}>
                                                    <Link to={`/user/${user.username}`}> Profile</Link>
                                                    <Link to={`/user/${user.username}?tab=saved`}> Saved</Link>
                                                    <Link to={`/accounts/edit/profile`}> Settings</Link>
                                                    <a onClick={logOut} href="/">Logout</a>
                                                </div>
                                            </div>
                                        </li>
                                    </React.Fragment>
                            }
                        </ul>
                    </div>
                </div>

                {/*floating button*/}
                <div className="floating-btn add">
                    <label htmlFor='modal-addpost' onClick={()=>openFileDialog()}>
                        <img src="/icon/add.svg"/>
                    </label>
                </div>
            </nav>
            <div style={{height: '54px'}}></div>
        </header>
    );
}


/**
 * Log user out?
 */
async function logOut(ev: React.SyntheticEvent<HTMLAnchorElement>) {
    ev.preventDefault();

    if (confirm("Log out?")) {
        const logged_out = await logUserOut(
            () => {
                location.reload();
            },
            (errs: Array<string>) => {
                alert(errs.join('\n'));
            }
        );
    }
}


/**
 * Redirects user to search page with query.
 *
 */
function onSearch(ev: React.SyntheticEvent<HTMLFormElement>, input: HTMLInputElement|null, history) {
    ev.preventDefault();
    const query = input?.value;

    if (query) {
        history.push(`/explore/search/${query}`);
    }
}


export default Header;
