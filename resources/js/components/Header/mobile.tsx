import React from 'react';
import { Link } from "react-router-dom";
import {useSelector} from 'react-redux';
import authUser from '../../state/auth_user';

type HeaderProps = {
    header_title?: string,
    hide_icon?: boolean,
    current_page: string
};

const backIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAB30lEQVRoge2ZPW8UMRCGn0F0XNrU663zr5CIyHFQEsKHkpDkUgJhvU3yq+hz/bVeWoZiiZAuLnJrjzeR9m1Hsp7X44/xGCZNmjRpa6mKa8KV82GeOpTk4NlKquLa7gqYAwosVgc7zdDhnmUDe4hUxfnuBz089BOYlInnWcAeoruZFzZhRWBv6LBlMtDDf4d78ADXt+vZ4AzYG+iXzTdgEYler9azfY7lz9DhzQ3U7e8lwttIKBkejE+h2neXir6PhLLAg2EGqqZbWsOD0SlU+e5C0MNIKCs8GCyhf/AfIqHs8JDZgPPhHDiKhEzgIeMecG04ozA8ZMqAa8MZysdIyBQeMhhwPnwFPkVC5vCQuIRcE04ZER4SMuCacIrwORIqBg8DM1D7cPIY4GGAgboJxwpfIqHi8JC1lJDyrzsG7oHah5N4FuRmtX7xqmQWDDZxWRNJaX8MJgwvsjImjEsJexPZTo6xTBQqp+1MFHzQ2JgwuXxKmjC7PaumW4rE3sV5TYzUVslnwrx+sTZhX4DdtRaj3bl0E2UqyP/N3Uh/NM1Eme60iK5ez94BkY8MfVnvdk/gg6M3sUD5uRFRlF+Dh03E2l4bX0yivLmd7/jiHElSlcoHX7Vhf2yUSZMmjay/AkobJMlU9UcAAAAASUVORK5CYII=`;

const Header: React.FC<HeaderProps> = ({header_title, hide_icon, current_page})=>{
    const {user} = authUser();

    return (
        <header className='hide-desktop'>
            <div className='fixed-wrapper'>
                <nav className="header border">
                    {!hide_icon?(
                        <div className="photo-btn">
                            <img src="/favicon/favicon.ico"/>
                        </div>)
                    :(
                        <div className="photo-btn">
                            <img id='go_back' src={backIcon} onClick={()=>history.back()} />
                        </div>
                    )}

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