import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {sign_in} from '../state/actions';
import {RootState} from '../state/store';
import {checkLoginStatus} from '../helpers/fetcher';

import Header from '../components/Header';
import Splash from '../components/Splash';


const Home: React.FC<{}> = ()=>{
    const [mounted, setMounted] = useState(false);
    const logged_in = useSelector<RootState>(({isLogged}) => isLogged);
    const dispatch = useDispatch();

    // check if the user is logged in
    useEffect(() => {
        if (logged_in) {
            setMounted(true);
        } else {
            const onErr = (errs: Array<string>) => {alert(errs.join("\n")), setMounted(true)};
            checkLoginStatus(onErr).then((logged) => {
                if (logged) {
                    dispatch(sign_in());
                }
                setMounted(true);
            });
        }
    });

    return !mounted ?
        (
            <Splash color='clr'/>
        )
        :
        (
            <div>
                <Header />
            </div>
        )
}


export default Home;

/*
<Header />

div.col
    <HomePosts />   .row1
    <HomeSideBar /> .row2

 */
