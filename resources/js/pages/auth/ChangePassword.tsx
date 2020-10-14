import React, {useState, useEffect} from 'react';
import Router, { Link } from "react-router-dom";
import nprogress from '../../routes/nprogress';
import {is_email} from '../../helpers/util';
import {change_password} from '../../helpers/fetcher';
import {UserSignin} from './Login';

import './styles/auth-page.scss';


/**
 * user is redirected from email message,
 * the token in the link is verified, and the user gets to change their password
 */

const ResetPassword: React.FC<Router.RouteComponentProps> = ({match, location}) => {
    const params = (match.params as any);
    const query = new URLSearchParams(location.search);
    const [errs, setErrs] = useState<string[]>([]);
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const clear = () => setErrs([]);

    let token = params.token as string;
    let email = query.get('email') || '';
    if (!is_email(email)) email = "";

    const onComplete = (ev) => {
        ev.preventDefault();

        if (pass1.length < 3) {
            return setErrs(['Password too short']);
        } else if (pass1 != pass2) {
            return setErrs(['Passwords dont match']);
        }

        changePassword(token, [pass1, pass2], setErrs);
    }

    return (
        <React.Fragment>
            <div className='bg'></div>
            <div className='card register-card auth-pg'>
                <div className="card-body">
                    <div className="brand-title">
                        <h1 className="card-title"></h1>
                    </div>

                    <div className='reset-pass-head'>
                        <p id='cpwd-title'> Change Password </p>
                        <p id='italic'> {email} </p>
                    </div>

                    <div className="login-box">
                        <form className="form-group" onSubmit={onComplete}>

                            <input type="password" placeholder="Enter new password" name='password'
                                value={pass1}
                                onChange={(e)=>{setPass1(e.target.value); clear()}}
                                required={true}
                            />

                            <input type="password" placeholder="Confirm new password"
                                value={pass2}
                                onChange={(e)=>{setPass2(e.target.value); clear()}}
                                required={true}
                            />

                            <button data-testid='submit' type='submit' className='btn btn-block btn-small btn-secondary'> Change password </button>
                        </form>

                        <div className="alt-btns">
                            {/* any errors? */}
                            {errs.length ?
                                (
                                    <div className="auth-pg-error-alert err" id='reg'>
                                        {errs.slice(0,1).map((el) => <div role='alert' key={el}> {el} </div>)}
                                    </div>
                                ) : ""
                            }
                        </div>

                        <div style={{height: '10px'}}></div>
                    </div>
                </div>
            </div>

            <div className='card signup-request-card auth-pg'>
                <div className='card-body'>
                    <p> <Link to="/">Enter as Guest</Link> </p>
                </div>
            </div>
        </React.Fragment>
    );

}


/**
 * handle signup submission
 */
async function changePassword(token: string, passwords: [string, string], setErrs) {
    setErrs([]);

    let res = await change_password(token, passwords, setErrs);
    if (!res.success) return;

    setErrs(['Password changed!, signing you in']);

    UserSignin({
        username: res.username,
        password: passwords[0],
    }, setErrs);
}


export default ResetPassword;
