import React, {useEffect, useState} from 'react';

import Header from '../components/Header';
import Splash from '../components/Splash';


const Home: React.FC<{}> = ()=>{
    const [mounted, setMounted] = useState(false);

    useEffect(()=>{
        setMounted(true);
    });

    return !mounted ?
        (
            <Splash color='clr'/>
        )
        :
        (
            <div>
                <Header page='/' />
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
