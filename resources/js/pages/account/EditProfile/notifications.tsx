import React, {useState} from 'react';
import useSWR from '../../../helpers/swr';
import Spinner from '../../../components/Spinner';
import Header from './Header';

import {fetchSettings} from '../../../helpers/fetcher';
import {userProfile} from '../../../state/userProfile.d';

const savingIcon = <svg style={{display: 'block', 'shapeRendering': 'auto'}} width="25px" height="25px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> <circle cx="50" cy="50" fill="none" stroke="#93dbe9" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(176.644 50 50)"> <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform> </circle> </svg>;

/**
 * map of settings that are currently beign saved in the DB
 * @type {Map}
 */
let isSaving: Map<string, boolean>;


/**
 * radio component
 * @param  {string} props.name  Radio name
 * @param  {string} props.value Radio value
 * @param  {[type]} props._set  onChange function
 */
const Radio = ({name,value,_set, saving})=>{
    const disabled = saving && isSaving.has(name);
    return (
        <div onChange={_set}>
            <div className='field-radio'> <input disabled={disabled} type='radio' value="On" name={name} defaultChecked={value=="On"} /> On </div>
            <div className='field-radio'> <input disabled={disabled} type='radio' value="Off" name={name} defaultChecked={value=="Off"} /> Off </div>
            {disabled && savingIcon}
        </div>
    );
};


const Notifications: React.FC<{user: userProfile}> = ({user})=>{
    const rendered = React.useRef<boolean|null>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const {data, isLoading} = useUserSettings();

    const [alerts, setAlerts] = useState<{[index:string]: boolean}>({
        post_likes: false,
        comments_likes: false,
        mentions: false,
        follows: false,
        comments: false,
    });

    if (data && !rendered.current) {
        setAlerts({
            post_likes: Boolean(data.notify_post_likes),
            comments_likes: Boolean(data.notify_comments_likes),
            mentions: Boolean(data.notify_mentions),
            follows: Boolean(data.notify_follows),
            comments: Boolean(data.notify_comments),
        });
        isSaving = new Map();
        rendered.current = true;
    }

    const change = (w) => {
        setAlerts({ ...alerts, [w]: !alerts[w] });
        updateSettings(w, !alerts[w], setSaving);
    }

    return (
        <Header page='notifications'>
            {isLoading && <Spinner type='list' />}
            {data&&(
            <div className='notifications'>
                <div className='row fields'>
                    <div className='field-name no-pl'><label> Post Likes </label> </div>
                    <div className='field-value'>
                        <Radio name="post_likes" value={alerts.post_likes?"On":"Off"} _set={()=>change('post_likes')} saving={saving} />
                        <div className='sample'>
                            <p> kodejuice liked your photo </p>
                        </div>
                    </div>
                </div>

                <div className='row fields'>
                    <div className='field-name no-pl'><label> Comment Likes </label> </div>
                    <div className='field-value'>
                        <Radio name="comments_likes" value={alerts.comments_likes?"On":"Off"} _set={()=>change('comments_likes')} saving={saving}/>
                        <div className='sample'>
                            <p> kodejuice liked your comment: "nice" </p>
                        </div>
                    </div>
                </div>

                <div className='row fields'>
                    <div className='field-name no-pl'><label> Comment </label> </div>
                    <div className='field-value'>
                        <Radio name="comments" value={alerts.comments?"On":"Off"} _set={()=>change('comments')} saving={saving} />
                        <div className='sample'>
                            <p> kodejuice commented on your photo: "Nice shot!" </p>
                        </div>
                    </div>
                </div>

                <div className='row fields'>
                    <div className='field-name no-pl'><label> Mentions </label> </div>
                    <div className='field-value'>
                        <Radio name="mentions" value={alerts.mentions?"On":"Off"} _set={()=>change('mentions')} saving={saving} />
                        <div className='sample'>
                            <p> kodejuice mentioned you in a post: "@{user.username} and i on the beach" </p>
                        </div>
                    </div>
                </div>

                <div className='row fields'>
                    <div className='field-name no-pl'><label> Follows </label> </div>
                    <div className='field-value' style={{'marginBottom': '30px'}}>
                        <Radio name="follows" value={alerts.follows?"On":"Off"} _set={()=>change('follows')} saving={saving} />
                        <div className='sample'>
                            <p> kodejuice started following you </p>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </Header>
    );
};


function updateSettings(name, value, setSaving) {
    setSaving(name);
    isSaving.set(name, true);

    console.log(`${name} => ${value}`);

    // TODO: update settings

    // isSaving.delete(name);
}


function useUserSettings() {
    const {data, error} = useSWR("...", fetchSettings);
    return {
        data,
        isLoading: !data && !error,
    }
}


export default Notifications;
