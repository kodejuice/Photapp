import React from 'react';
import {Link} from 'react-router-dom';
import {logUserOut} from '../../../helpers/fetcher';
import {useDispatch} from 'react-redux';
import showAlert from '../../../components/Alert/showAlert';

export const EditProfileModal: React.FC<{}> = ()=>{
    return (
        <React.Fragment>
            <input className="modal-state" id="modal-editprofile" type="checkbox"/>
            <div className="modal">
                <label className="modal-bg" htmlFor="modal-editprofile"></label>
                <div className="modal-body edit-profile">
                    <button> <Link to="/accounts/edit/password">Change Password</Link> </button>
                    <button> <Link to="/accounts/edit/notifications">Notifications</Link> </button>
                    <label htmlFor='modal-logout'> Log out </label>
                    <label htmlFor='modal-editprofile'> Cancel </label>
                </div>
            </div>
        </React.Fragment>
    );
}


export const LogoutModal: React.FC<{}> = ()=>{
    const dispatch = useDispatch();

    const logOut = async ()=>{
        await logUserOut(
            () => {
                showAlert(dispatch, ['Logging you out'], 'success');
                location.reload();
            },
            (errs: Array<string>) => {
                showAlert(dispatch, errs, 'error', 20);
            }
        );
    }

    return (
        <React.Fragment>
            <input className="modal-state" id="modal-logout" type="checkbox"/>
            <div className="modal">
                <label className="modal-bg" htmlFor="modal-logout"></label>
                <div className="modal-body logout">
                    <div className='header'> Logout? </div>
                    <div className='row'>
                        <div className='col col-fill'><button onClick={logOut}>Yes</button></div>
                        <div className='col col-fill'><label htmlFor='modal-logout'>No</label></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
