import React from 'react';
import {AlertProp} from './alert-prop.d';
import {highlightMentions} from '../../../helpers/mini-components';


const MentionAlert: React.FC<{data: AlertProp}> = ({data})=>{
    return <div> {JSON.stringify(data)} </div>;  
                    <span id='msg'>{highlightMentions(limit(d.message, 127))}</span>
}

export default MentionAlert;
