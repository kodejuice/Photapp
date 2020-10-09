import React from 'react';
import {Link} from 'react-router-dom';
import Header from '../components/Header';

import "./styles/PageNotFound.scss";

const NotFound: React.FC<{}> = ()=>{
    const name: string = "homw";

    return (
        <React.Fragment>
            <Header page={null} header_title="Not Found" />

            <div className='page-not-found'>
                <h2> Sorry, this page isn't available. </h2>

                <p> The link you followed may be broken, or the page may have been removed. <Link to={`/`}>Go back to PhotApp</Link>. </p>
            </div>
        </React.Fragment>
    );
}


export default NotFound;
