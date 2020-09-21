import React, {useState, useRef} from 'react';
import Header from './Header';

import {LazyDPSync} from '../../../components/LazyDP';
import {userProfile} from '../../../state/userProfile.d';

const savingIcon = <svg style={{margin: '0 auto', display: 'block', 'shapeRendering': 'auto'}} width="25px" height="25px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> <circle cx="50" cy="50" fill="none" stroke="#93dbe9" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(176.644 50 50)"> <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform> </circle> </svg>;

const Profile: React.FC<{user: userProfile}> = ({user})=>{
    const inputFile = useRef<HTMLInputElement>(null);

    const [saving, setSaving] = useState(false);
    const [full_name, setFullName] = useState(user.full_name||"");
    const [bio, setBio] = useState(user.bio||"");
    const [email, setEmail] = useState(user.email||"");
    const [loadingDP, setDPLoading] = useState(false);

    const onSubmit = ()=>{
        let pwd = prompt("Enter password to save settings");

        setSaving(true);

        // TODO: make it work
    };

    return (
        <Header page='profile'>
            <div className='row head-field'>
                <div className='col head-field-name'>
                    <LazyDPSync data={user} loading={loadingDP} />
                </div>
                <div className='col head-field-value'>
                    <h1 className='username'> {user.username} </h1>
                    <div className='change-dp'>
                        <button disabled={loadingDP || saving} onClick={()=>(inputFile.current as HTMLInputElement).click()}>
                            Change Profile Photo
                        </button>
                    </div>
                </div>
            </div>

            <div className='row fields'>
                <div className='field-name'><label> Name </label> </div>
                <div className='field-value'> <input placeholder='Name' type='text' value={full_name} onChange={(e)=>setFullName(e.target.value)} /> </div>
            </div>
            <div className='row fields'>
                <div className='field-name'> <label> Bio </label> </div>
                <div className='field-value'> <textarea value={bio} onChange={(e)=>setBio(e.target.value)} /> </div>
            </div>
            <div className='row fields'>
                <div className='field-name'> <label> Email </label> </div>
                <div className='field-value'> <input placeholder='Email' type='email' value={email} onChange={(e)=>setEmail(e.target.value)} required /> </div>
            </div>
            <div className='row fields'>
                <div className='field-name'> </div>
                <div className='field-value'> <button disabled={loadingDP || saving} onClick={onSubmit}> {saving ? savingIcon : "Submit"} </button> </div>
            </div>

            <input hidden accept='image/*' name="image" type='file' ref={inputFile} onChange={(ev)=>uploadUserDP(ev, setDPLoading)} />
        </Header>
    );
};


/**
 * uploads user DP
 */
function uploadUserDP(ev: React.FormEvent<HTMLInputElement>, setDPLoading) {
    ev.stopPropagation();
    ev.preventDefault();

    let file = ((ev.target as HTMLInputElement).files as FileList)[0];

    if (file.size > 4194304) { // > 4MB
        return alert("Image too large (max 4MB)");
    }

    let form = new FormData();
    form.append('image', file);

    // TODO: axios.post('/user/dp', form);

    setDPLoading(true);
}

export default Profile;
