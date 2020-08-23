import React, {useEffect, useState} from 'react';

import Header from '../components/Header';
// import Splash from '../components/Splash';


const Home: React.FC<{}> = ()=>{
    const [mounted, setMounted] = useState(false);

    return (
        <React.Fragment>
            <Header page='/' />
        </React.Fragment>
    );
}


export default Home;

/*
<Header />

div.col
    <HomePosts />   .row1
    <HomeSideBar /> .row2

 */
