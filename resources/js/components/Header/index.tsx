import React, {useRef} from 'react';
import { useHistory, Link } from "react-router-dom";
import {useSelector} from 'react-redux';
import {RootState} from '../../state/store';
import {userProfile as profile} from '../../state/userProfile.d';

import './style.scss';


export default function Header() {
    const ref = useRef(null);
    const history = useHistory();
 
    const logged_in = useSelector<RootState, boolean>(({isLogged}) => isLogged);
    const user = useSelector<RootState, profile>(({userProfile}) => userProfile);

    return (
        <nav className="header border fixed">
            <div className="header-wrapper row">
                <div className="header-brand col-3 col">
                    <Link to="/"><h1 className="bg-logo"> </h1></Link>
                </div>
                <div className="search-bar col-3 col hide-width-814">
                    <div className='search-input-wrap'>
                        <form onSubmit={_=>onSearch(_, ref.current, history)}>
                            <input ref={ref} type='search' placeholder='Search' />
                        </form>
                    </div>
                </div>
                <div className="nav-links col-fill col">
                    <ul className="inline">
                        <li><Link to="/"><img src="/test/home.png"/></Link></li>
                        <li><Link to="?feed=following"><img src="/test/feed.png"/></Link></li>
                        <li><Link to="/activity"><img src="/test/heart.png"/></Link></li>
                        {
                            !user?.id ?
                                <li>
                                    <Link to="/login"><img src="/test/login.png"/></Link>
                                </li>
                                : <li>
                                    <Link to={`/user/${user.username}`}><img className='avatar' src={`/avatar/${user.profile_pic}`} /></Link>
                                  </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
  );

}


/**
 * Searches for the input.
 *
 */
function onSearch(ev: React.SyntheticEvent<HTMLFormElement>, input: HTMLInputElement|null, history) {
    ev.preventDefault();
    const query = input?.value;

    if (query) {
        history.push(`/search?q=${query}`);
    }
}


