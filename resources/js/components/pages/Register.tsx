import React, {useState} from 'react';
import { useHistory, Link } from "react-router-dom";
import Cookie from 'js-cookie';
import { useForm } from "react-hook-form";
import nprogress from '../../routes/nprogress';
import {auth_fetch} from '../../helpers/fetcher';

import '../styles/auth-page.scss';


type Inputs = {
    username: string,
    password: string,
    email: string,
    full_name?: string,
    password_confirmation?: string,
};


/**
 * props to apply to <inputs/> when `err` is not undefined
 */
const errorProps: (err) => object|undefined = (err) => {
    const msg = {
        'maxLength': 'too long',
        'minLength': 'too short',
        'required': 'input required',
    };

    return err && {
        className: 'border border-danger',
        title: msg[err.type],
    };
};



const Register: React.FC<{}> = () => {
    const history = useHistory();
    const [errs, setErrs] = useState([]);
    const { register, handleSubmit, watch, errors } = useForm<Inputs>();

    const onComplete: (d:Inputs)=>void = d => {
        UserSignup(d, setErrs, history);
    }

    return (
        <div>
            <div className='card register-card auth-pg'>
                <div className="card-body">
                    <div className="brand-title">
                        <h1 className="card-title"></h1>
                    </div>

                    <div className="login-box">
                        <form className="form-group" onSubmit={handleSubmit(onComplete)}>

                            <input type="email" placeholder="Email" id="email" name='email'
                                ref={register({required:true, maxLength: 50})}
                                {...errorProps(errors.email)}
                            />

                            <input type="username" placeholder="Username" id="username" name='username'
                                ref={register({required:true, minLength: 4, maxLength: 40})}
                                {...errorProps(errors.username)}
                            />

                            <input type="full_name" placeholder="Full name" id="full_name" name='full_name'
                                ref={register({maxLength: 50})}
                                {...errorProps(errors.full_name)}
                            />

                            <input type="password" placeholder="Password" id="pass" name='password'
                                ref={register({required:true, minLength: 6})}
                                {...(errorProps(errors.password))}
                            />

                            <button type='submit' className='btn btn-block btn-small btn-secondary'> Sign up </button>
                        </form>

                        <div className="alt-btns">
                            {/* any errors? */}
                            {errs.length ?
                                (
                                    <div className="auth-pg-error-alert" id='reg'>
                                        {errs.slice(0,2).map((el) => <div key={el}> {el} </div>)}
                                    </div>
                                ) : ""
                            }
                        </div>

                    </div>
                </div>
            </div>

            <div className='card signup-request-card auth-pg'>
                <div className='card-body'>
                    <p> Have an account? <Link to="/login">Log in</Link> </p>
                </div>
            </div>
        </div>
    );

}


/**
 * handle signup submission
 */
async function UserSignup(data: Inputs, setErrs, history) {
    setErrs([]);

    const {username, password, email, full_name} = data;
    let token = await auth_fetch('/api/register', {
        username,
        password,
        email,
        full_name,
        password_confirmation: password
    }, setErrs );

    if (token) {
        // store auth token cookie and redirect to home
        storeCookie(token, ()=>{
            history.push('/');
        });
    }
}

/**
 * Stores a cookie and invokes callback()
 *
 * @param      {string}    token     The auth token
 * @param      {Function}  callback  The callback
 */
function storeCookie(token: string, callback: ()=>void) {
    Cookie.set('AUTH_TOKEN', token);

    callback();
}

export default Register;
