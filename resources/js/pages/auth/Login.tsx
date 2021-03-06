import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import Cookie from 'js-cookie';
import { useForm } from "react-hook-form";
import {auth_fetch} from '../../helpers/fetcher';
import authUser from '../../state/auth_user';

import Splash from '../../components/Splash';
import './styles/auth-page.scss';

type Inputs = {
    username: string,
    password: string,
};

const errorProps: (err) => object|undefined = (err) => {
    return err && {
        className: 'border border-danger',
    };
};

const Window = window as any;


const Login: React.FC<{}> = () => {
    const [errs, setErrs] = useState<Array<string>>([]);
    const [passwordShown, showPass] = useState<boolean>(false);
    const { register, handleSubmit, watch, errors } = useForm<Inputs>();

    const logged_in = authUser().logged;

    const onComplete: (d:Inputs)=>void = d => {
        UserSignin(d, setErrs);
    }

    const showPassClick: React.ReactEventHandler<HTMLDivElement> = ev => {
        ev.preventDefault();
        showPass(!passwordShown);
    };


    // user already logged in?, redirect to home page
    if (logged_in) {
        Window.location = "/";
        return <Splash color='grey' />;
    }


    return (
        <React.Fragment>
            <div className='bg'></div>
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
                                data-testid="user-input"
                            />

                            <div id='password-container'>
                                <input type={passwordShown?"text":"password"} placeholder="Password" id="pass" name='password'
                                    ref={register({required:true})}
                                    {...(errorProps(errors.password))}
                                    data-testid="pass-input"
                                />
                                <div data-testid="show-pass" className='btn btn-small'
                                    onClick={showPassClick}
                                    id='show-pass'
                                >
                                    {passwordShown?"Hide":"Show"}
                                </div>
                            </div>

                            <button data-testid='submit' type="submit" className='btn btn-block btn-small btn-secondary'> Log in </button>
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
                        {errs.slice(0,3).map((el) => <div role='alert' key={el}> {el} </div>)}
                    </div>
                ) : ""
            }

            <div className='card signup-request-card auth-pg'>
                <div className='card-body'>
                    <p> Don't have an account? <Link to="/register">Sign Up</Link> </p>
                </div>
            </div>
        </React.Fragment>
    );
}


/**
 * handle login submission
 */
export async function UserSignin({username, password}, setErrs) {
    setErrs([]);

    let res = await auth_fetch('/api/login', {
        username, password
    }, setErrs );

    if (res?.token) {
        // out jest test waits on the div[role=alert] that this state
        // controlls after the mock authentication 
        setErrs(['redirecting...']);

        // store auth token cookie and redirect to home
        storeCookie(res.token, ()=>{
            Window.location = '/';
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
