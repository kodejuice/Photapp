import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import nprogress from '../../routes/nprogress';
import {send_password_reset_link} from '../../helpers/fetcher';

import './styles/auth-page.scss';


/**
 * send password reset link to user email
 */

const PasswordReset: React.FC<{}> = () => {
    const [errs, setErrs] = useState([]);
    const [email, setEmail] = useState('');

    const onComplete = (ev) => {
        ev.preventDefault();
        sendResetLink(email, setErrs);
    }

    return (
        <React.Fragment>
            <div className='bg'></div>
            <div className='card register-card auth-pg'>
                <div className="card-body">
                    <div className="brand-title">
                        <h1 className="card-title"></h1>
                    </div>

                    <div className="login-box">
                        <form className="form-group" onSubmit={onComplete}>

                            <input type="email" placeholder="Email" id="email" name='email'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                required={true}
                            />

                            <button data-testid='submit' type='submit' className='btn btn-block btn-small btn-secondary'> Send reset link </button>
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

                        {errs.length == 0 || !((errs[0] as string).includes(email)) ? (
                            <div className="separate-or note">
                                <p> Enter your email to receive a password reset link. </p>
                            </div>
                        ) : (
                            <div style={{height: '40px'}}></div>
                        )}

                        <div className='alt-btns'>
                            <p> <Link to="/login"> Login </Link> </p>
                        </div>
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
async function sendResetLink(email: string, setErrs) {
    setErrs([]);

    let res = await send_password_reset_link(email, setErrs);

    if (res?.success) {
        setErrs([`A password reset link has been sent to ${email}, check your spam folder if you can't find it.`]);
    }
}


export default PasswordReset;
