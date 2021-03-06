import React, {useState, useEffect} from 'react';
import { Switch } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {sign_in, set_user} from '../state/actions';
import {checkLoginStatus} from '../helpers/fetcher';
import authUser from '../state/auth_user';

import AppEvents from './AppEvents';
import AddPostModal from './AddPost';
import ProgressRoute from '../routes/ProgressRoute';

import routes from '../routes';
import Splash from './Splash';


const App: React.FC<{path?:string}> = ({path})=>{
    const [mounted, setMounted] = useState(false);
    const dispatch = useDispatch();
    const logged_in = authUser().logged;

    // check if the user is logged in
    useEffect(() => {
        if (logged_in) {
            setMounted(true);
        } else {
            const onErr = (errs: Array<string>) => {alert(errs.join("\n")), setMounted(true)};
            checkLoginStatus(onErr).then((logged) => {
                if (logged) {
                    const {id, username, bio, email, full_name, profile_pic, followers, follows, posts_count} = logged as any;
                    dispatch(sign_in());
                    dispatch(set_user({id, username, bio, email, full_name, profile_pic, followers, follows, posts_count}));
                }
                setMounted(true);
            }).catch(()=>{});
        }
    });

    // display a splash screen if not mounted yet
    return !mounted ?
        (
            <Splash color='grey' />
        )
        :
        (
            <React.Fragment>
                <main role={logged_in ? "app-logged" : "app-guest"}>
                    <AddPostModal />
                    <AppEvents />

                    <Switch>
                        {routes(path || '/').map((prop, i)=>
                            <ProgressRoute key={i} {...prop} />
                        )}
                    </Switch>
                </main>

                <footer className='foot'>
                    <div className='links'>
                        <a id='fork' href="https://github.com/kodejuice/photapp"> <img src='/icon/github.png'/> Fork on Github </a>
                        <a id='profile' href='http://kodejuice.ml'> <img src='/icon/sb.png'/> Sochima Biereagu </a>
                    </div>
                </footer>
            </React.Fragment>
        )
}


export default App;
