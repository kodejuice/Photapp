import React, {useRef, useState} from 'react';
import { useHistory, Link } from "react-router-dom";

import {logUserOut} from '../../helpers/fetcher';
import authUser from '../../state/auth_user';

const homeIcon = `data:image/png;base64,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`;
const heartIcon = `data:image/png;base64,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`;
const loginIcon = `data:image/png;base64,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`;
const avatarIcon = `data:image/png;base64,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`;
const exploreIcon = `data:image/png;base64,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`;

const Header: React.FC<{}> = ()=>{
    const ref = useRef(null);
    const history = useHistory();

    const [dropdown_shown, showDropdown] = useState(false) ;
    const {user} = authUser();

    const toggleDropdown = ()=>{
        showDropdown(!dropdown_shown);

        // toggle dropdown in 7 seconds
        // if this component is still mounted
        setTimeout((reverse)=>{
            if (ref.current != null) showDropdown(reverse);
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
                                !user?.id ?
                                    <React.Fragment>
                                        <li> <Link to="/login"><img src={heartIcon}/></Link> </li>
                                        <li> <Link to="/login"><img src={loginIcon}/></Link> </li>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <li><Link to="/activity"><img src={heartIcon}/></Link></li>
                                        <li>
                                            <div className="dropdown">
                                                <img onClick={_=>toggleDropdown()}
                                                     className='dropbtn avatar'
                                                     src={user.profile_pic ? `/avatar/${user.profile_pic}` : avatarIcon}
                                                />
                                                <div className={`dropdown-content ${dropdown_shown?'show':''}`}>
                                                    <Link to={`/user/${user.username}`}> Profile</Link>
                                                    <Link to={`/user/${user.username}?tab=saved`}> Saved</Link>
                                                    <Link to={`/account/settings`}> Settings</Link>
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
                    <img src="/icon/add.svg"/>
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
