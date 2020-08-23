import React, {useRef, useState} from 'react';
import { useHistory, Link } from "react-router-dom";

import {logUserOut} from '../../helpers/fetcher';
import authUser from '../../helpers/auth_user';


const Header: React.FC<{}> = ()=>{
    const ref = useRef(null);
    const history = useHistory();

    const [dropdown_shown, showDropdown] = useState(false) ;
    const {user} = authUser();

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
                            <li><Link to="/"><img src="/icon/home.png"/></Link></li>
                            <li><Link to="/explore"><img src="/icon/explore.png"/></Link></li>
                            <li><Link to="/activity"><img src="/icon/heart.png"/></Link></li>
                            {
                                !user?.id ?
                                    <li>
                                        <Link to="/login"><img src="/icon/login.png"/></Link>
                                    </li>
                                    :
                                    <li>
                                        <div className="dropdown">
                                            <img onClick={_=>showDropdown(!dropdown_shown)}
                                                 className='dropbtn avatar'
                                                 src={user.profile_pic ? `/avatar/${user.profile_pic}` : '/icon/avatar.png'}
                                            />
                                            <div className={`dropdown-content ${dropdown_shown?'show':''}`}>
                                                <Link to={`/user/${user.username}`}> Profile</Link>
                                                <Link to={`/user/${user.username}?tab=saved`}> Saved</Link>
                                                <Link to={`/account/settings`}> Settings</Link>
                                                <a onClick={logOut} href="/">Logout</a>
                                            </div>
                                        </div>
                                    </li>
                            }
                        </ul>
                    </div>
                </div>

                {/*floating button*/}
                <div className="floating-btn add">
                    <img src="/icon/add.png"/>
                </div>
            </nav>
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
        history.push(`/explore?q=${query}`);
    }
}


export default Header;
