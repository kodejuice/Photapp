import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import Header from './Header';

import {LazyDPSync} from '../../../components/LazyDP';
import {userProfile} from '../../../state/userProfile.d';
import showAlert from '../../../components/Alert/showAlert';

const savingIcon = <svg style={{margin: '0 auto', display: 'block', 'shapeRendering': 'auto'}} width="25px" height="25px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> <circle cx="50" cy="50" fill="none" stroke="#93dbe9" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(176.644 50 50)"> <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform> </circle> </svg>;

const Password: React.FC<{user:userProfile}> = ({user})=>{
    const dispatch = useDispatch();

    const [saving, setSaving] = useState(false);
    const [old_pass, setOldPass] = useState("");
    const [new_pass, setNewPass1] = useState("");
    const [new_pass_2, setNewPass2] = useState("");

    const onSubmit = ()=>{
        if (old_pass.length < 6) {
            return showAlert(dispatch, ['Wrong old password']);
        } else if (new_pass != new_pass_2) {
            return showAlert(dispatch, ['New passwords dont match']);
        } else if (new_pass.length < 6) {
            return showAlert(dispatch, ['Invalid new password (min-length: 6)']);
        } else if (new_pass == old_pass) {
            return showAlert(dispatch, ['New password and Old Password are same']);
        }

        setSaving(!saving);
        // TODO: save password
    };

    return (
        <Header page='password'>
            <div className='change-pass'>
                <div className='row head-field'>
                    <div className='col head-field-name'>
                        <LazyDPSync data={user} />
                    </div>
                    <div className='col head-field-value'>
                        <h1 className='username big'> {user.username} </h1>
                    </div>
                </div>

                <div className='row fields'>
                    <div className='field-name no-pl'><label> Old Password </label> </div>
                    <div className='field-value'> <input type='password' value={old_pass} onChange={(e)=>setOldPass(e.target.value)} /> </div>
                </div>

                <div className='row fields'>
                    <div className='field-name no-pl'><label> New Password </label> </div>
                    <div className='field-value'> <input type='password' value={new_pass} onChange={(e)=>setNewPass1(e.target.value)} /> </div>
                </div>

                <div className='row fields'>
                    <div className='field-name no-pl'><label> Confirm New Password </label> </div>
                    <div className='field-value'> <input type='password' value={new_pass_2} onChange={(e)=>setNewPass2(e.target.value)} /> </div>
                </div>

                <div className='row fields'>
                    <div className='field-name'> </div>
                    <div className='field-value'> <button disabled={saving} onClick={onSubmit}> {saving ? savingIcon : "Change Password"} </button> </div>
                </div>

            </div>

        </Header>
    );
};

export default Password;
