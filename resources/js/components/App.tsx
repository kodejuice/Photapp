import React, {useState, useEffect} from 'react';
import { Switch } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {sign_in, set_user} from '../state/actions';
import {checkLoginStatus} from '../helpers/fetcher';
import authUser from '../state/auth_user';

import ProgressRoute from '../routes/ProgressRoute';

import routes from '../routes';
import Splash from '../components/Splash';


const App: React.FC<{path?:string}> = ({path})=>{
    path = path || '/';
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
                    const {id, username, email, full_name, profile_pic, followers, follows, posts_count} = logged as any;
                    dispatch(sign_in());
                    dispatch(set_user({id, username, email, full_name, profile_pic, followers, follows, posts_count}));
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
            <main role={logged_in ? "app-logged" : "app-guest"}>
                <Switch>
                    {routes(path).map((prop, i)=>
                        <ProgressRoute key={i} {...prop} />
                    )}
                </Switch>
            </main>
        )
}


export default App;
