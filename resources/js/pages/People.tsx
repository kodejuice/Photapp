import React from 'react';
import Header from '../components/Header';
import Suggestions from '../components/Suggestions';

import "./styles/People.scss";

const People: React.FC<{}> = ()=>{
    return (
        <React.Fragment>
            <Header page='explore' hide_icon={true} header_title="Suggested" />

            <div className='suggestions page'>
                <Suggestions limit={80} />
            </div>
        </React.Fragment>
    );
}

export default People;
