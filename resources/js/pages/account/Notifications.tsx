import React, {useEffect, useState} from 'react';

import Header from '../../components/Header';


const Notifications: React.FC<{}> = ()=>{
    const [mounted, setMounted] = useState(false);

    return (
        <React.Fragment>
            <Header page='activity' hide_icon={true} header_title='Activity' />
        </React.Fragment>
    );
}


export default Notifications;
