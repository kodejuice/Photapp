import React from 'react';
import {AlertProp} from './alert-prop.d';

const MentionAlert: React.FC<{data: AlertProp}> = ({data})=>{
    return <div> {JSON.stringify(data)} </div>;  
}

export default MentionAlert;
