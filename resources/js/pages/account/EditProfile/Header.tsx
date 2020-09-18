import React from 'react';
import {Link} from 'react-router-dom';
import {camel} from '../../../helpers/util';

type pages = 'profile'|'password'|'notifications';

const NavBar: React.FC<{active: pages}> = ({active})=>{
    const link = (page: pages) => `/accounts/edit/${page}`;
    const links: {[index:string]: string} = {
        'profile': link('profile'),
        'notifications': link('notifications'),
        'password': link('password'),
    };
    const list: pages[] = ['profile','notifications','password'];
    const title = (p: pages) => p == 'password' ? "Change password" : `Edit ${camel(p)}`;

    return (
        <React.Fragment>
            <div className='links'>
                {list.map((p,i)=>(
                    <div key={p} className={`active-${p==active} last-${i==list.length-1}`}>
                        <Link to={links[p]}> {title(p)} </Link>
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
}


const Header: React.FC<{page: pages}> = ({children, page})=>{
    return (
        <React.Fragment>
            <div className='row page-wrapper'>
                <div className='col-4 nav'>
                    <NavBar active={page} />
                </div>
                <div className='col-fill'>
                    {children}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Header;
