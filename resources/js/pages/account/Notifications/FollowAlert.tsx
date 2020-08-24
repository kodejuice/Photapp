import React from 'react';
import {AlertProp} from './alert-prop.d';

const FollowAlert: React.FC<{data: AlertProp}> = ({data})=>{
    return <div> {JSON.stringify(data)} </div>;  
}

export default FollowAlert;
