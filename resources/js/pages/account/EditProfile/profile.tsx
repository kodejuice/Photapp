import React, {useState, useRef, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import Header from './Header';
import {LazyDPSync} from '../../../components/LazyDP';
import {userProfile} from '../../../state/userProfile.d';
import {uploadUserDP, updateProfile} from '../../../helpers/fetcher';
import showAlert from '../../../components/Alert/showAlert';

const savingIcon = <svg style={{margin: '0 auto', display: 'block', 'shapeRendering': 'auto'}} width="25px" height="25px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> <circle cx="50" cy="50" fill="none" stroke="#93dbe9" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(176.644 50 50)"> <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform> </circle> </svg>;

const Profile: React.FC<{user: userProfile}> = ({user})=>{
    const dispatch = useDispatch();
    const unmounted = useRef(false);
    const inputFile = useRef<HTMLInputElement>(null);

    const User: {[index:string]: string} = {bio: str(user.bio), email: str(user.email), full_name: str(user.full_name)};

    const [saving, setSaving] = useState(false);
    const [full_name, setFullName] = useState<string>(User.full_name);
    const [bio, setBio] = useState<string>(User.bio);
    const [email, setEmail] = useState<string>(User.email);
    const [loadingDP, setDPLoading] = useState(false);

    useEffect(()=>{
        unmounted.current = false;
        return ()=>{unmounted.current = true};
    });

    const onSubmit = ()=>{
        if (saving) return;
        let password: string = prompt("Enter your password to save changes", "") as string;
        if (password.length < 6) return alert("Password should have at least 6 characters");

        setSaving(true);

        updateProfile(collect_valids({bio, email, full_name, password}, User))
        .then(res => {
            if (unmounted.current) {
                if (res?.success) location.reload();
                return;
            }
            if (res?.errors) return showAlert(dispatch, res.errors);
            if (res?.success) {
                showAlert(dispatch, ['Profile updated!'], 'success');
                location.reload();
            }
        })
        .catch(()=>{})
        .finally(()=>{
            if (unmounted.current) return;
            setSaving(false);
        })
    };

    return (
        <Header page='profile'>
            <div className='row head-field' role='User-info'>
                <div className='col head-field-name'>
                    <LazyDPSync data={User} loading={loadingDP} />
                </div>
                <div className='col head-field-value'>
                    <h1 className='username'> {User.username} </h1>
                    <div className='change-dp'>
                        <button disabled={loadingDP || saving} onClick={()=>(inputFile.current as HTMLInputElement).click()}>
                            Change Profile Photo
                        </button>
                    </div>
                </div>
            </div>

            <div className='row fields' role={`name-${full_name}`}>
                <div className='field-name'><label> Name </label> </div>
                <div className='field-value'> <input placeholder='Name' type='text' value={full_name} onChange={(e)=>setFullName(e.target.value)} /> </div>
            </div>
            <div className='row fields' role={`bio-${bio}`}>
                <div className='field-name'> <label> Bio </label> </div>
                <div className='field-value'> <textarea  value={bio} onChange={(e)=>setBio(e.target.value)} /> </div>
            </div>
            <div className='row fields' role={`email-${email}`}>
                <div className='field-name'> <label> Email </label> </div>
                <div className='field-value'> <input placeholder='Email' type='email' value={email} onChange={(e)=>setEmail(e.target.value)} required /> </div>
            </div>
            <div className='row fields'>
                <div className='field-name'> </div>
                <div className='field-value'>
                    <button
                        disabled={loadingDP || saving || (email==User.email && bio==User.bio && full_name==User.full_name) || !email.length}
                        onClick={onSubmit}> {saving ? savingIcon : "Submit"}
                    </button>
                </div>
            </div>

            <input hidden accept='image/*' name="image" type='file' ref={inputFile} onChange={(ev)=>uploadUserDP(ev, setDPLoading)} />
        </Header>
    );
};


/**
 * str||""
 *
 */
function str(s: string|undefined): string {
    return s || "";
}


function collect_valids({email, bio, full_name, password}: {[index:string]: string}, User) {
    const fields: {[index:string]: string} = {password};

    if (bio.length)
        fields.bio = bio;

    if (full_name.length)
        fields.full_name = full_name;

    if (email.length)
        fields.email = email;

    return fields;
}

export default Profile;
