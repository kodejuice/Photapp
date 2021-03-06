import {set_alert_messages} from '../../state/actions';


export default function showAlert(dispatch, msgs: string[], type: 'error'|'success' = 'error', N=5) {
    dispatch(set_alert_messages(msgs, type));

    // progressively remove the messages after every 2 seconds
    // start after N seconds of displaying the alerts
    for (let i = 1; i <= msgs.length; ++i) {

        setTimeout(()=>{
            msgs = msgs.slice(0, -1); // remove last message
            dispatch(set_alert_messages(msgs, type));
        }, (N * 1000) + (i * 2000));

   }

}

