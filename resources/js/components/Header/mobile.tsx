import React from 'react';
import { Link } from "react-router-dom";
import {useSelector} from 'react-redux';
import {RootState} from '../../state/store';
import {userProfile as profileObject} from '../../state/userProfile.d';


const Header: React.FC<{}> = ()=>{

    const user = useSelector<RootState, profileObject>(({userProfile}) => userProfile);

    return (
        <header className='hide-desktop'>
            <div className='header-wrapper'>
                <nav className="header border">
                    <div className="photo-btn">
                        <img src="/favicon/favicon.ico"/>
                    </div>
                    <Link to="/"><h1 className='bg-logo'> </h1></Link>
                </nav>
            </div>

            <footer className='border footer'>
                <div className="row btns">
                    <div className="col col-fill btn">
                        <Link to="/"> <img src="/icon/home.png"/> </Link>
                    </div>
                    <div className="col col-fill btn">
                        <Link to="/explore"> <img src="/icon/search.png"/> </Link>
                    </div>
                    <div className="col col-fill btn">
                        <img src="/icon/add.png"/>
                    </div>
                    <div className="col col-fill btn">
                        <Link to="/activity"> <img src="/icon/heart.png"/> </Link>
                    </div>
                    <div className="col col-fill btn">
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