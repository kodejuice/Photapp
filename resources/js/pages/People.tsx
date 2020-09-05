import React from 'react';
import Header from '../components/Header';
import Suggestions from '../components/Suggestions';

const People: React.FC<{}> = ()=>{
    return (
        <React.Fragment>
            <Header page='explore' />

            <div className='suggestions page'>
                <Suggestions limit={80} />
            </div>
        </React.Fragment>
    );
}

export default People;

