import React, {useEffect, useState} from 'react';
import { useHistory, Link } from "react-router-dom";
import Cookie from 'js-cookie';
import { useForm } from "react-hook-form";
import {auth_fetch} from '../../helpers/fetcher';

import Splash from '../Splash';
import '../styles/auth-page.scss';


type Inputs = {
    username: string,
    password: string,
};

const errorProps: (err) => object|undefined = (err) => {
    return err && {
        className: 'border border-danger',
    };
};



const Login: React.FC<{}> = () => {
    const history = useHistory();
    const [errs, setErrs] = useState<Array<string>>([]);
    const { register, handleSubmit, watch, errors } = useForm<Inputs>();

    const onComplete: (d:Inputs)=>void = d => {
        UserSignin(d, setErrs, history);
    }

    // user already logged in?, redirect to home page
    if (Cookie.get("AUTH_TOKEN")) {
        (window as any).location = "/";
        return <Splash color='grey' />;
    }


    return (
        <div>
            <div className='card login-card auth-pg'>
                <div className="card-body">
                    <div className="brand-title">
                        <h1 className="card-title"></h1>
                    </div>

                    <div className="login-box">
                        <form className="form-group" onSubmit={handleSubmit(onComplete)}>

                            <input type="text" placeholder="Username" id="user" name='username'
                                ref={register({required:true})}
                                {...errorProps(errors.username)}
                            />

                            <input type="password" placeholder="Password" id="pass" name='password'
                                ref={register({required:true})}
                                {...(errorProps(errors.password))}
                            />

                            <button type="submit" className='btn btn-block btn-small btn-secondary'> Log in </button>
                        </form>

                        <div className="separate-or"> or </div>

                        <div className="alt-btns">
                            <div id='guest'><Link to="/"> Enter as Guest </Link></div>
                            <div id='pass-reset'><Link to="/password-reset"> Forgot password? </Link></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* any errors? */}
            {errs.length ?
                (
                    <div className="auth-pg-error-alert">
                        {errs.slice(0,3).map((el) => <div key={el}> {el} </div>)}
                    </div>
                ) : ""
            }

            <div className='card signup-request-card auth-pg'>
                <div className='card-body'>
                    <p> Don't have an account? <Link to="/register">Sign Up</Link> </p>
                </div>
            </div>
        </div>
    );
}


/**
 * handle login submission
 */
async function UserSignin({username, password}: Inputs, setErrs, history) {
    setErrs([]);

    let token = await auth_fetch('/api/login', {
        username, password
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

export default Login;
