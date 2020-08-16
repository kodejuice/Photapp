import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import {useSelector} from 'react-redux';
import Cookie from 'js-cookie';
import '../styles/auth-page.scss';


const Login: React.FC<{}> = () => {
    const history = useHistory();

    if (Cookie.get("AUTH_TOKEN")) {
        // user already logged in, redirect to home page
        history.push("/");
        return;
    }

    return (
        <div>
            <div className='card login-card auth-pg'>
                <div className="card-body">
                    <div className="brand-title">
                        <h1 className="card-title"></h1>
                    </div>

                    <div className="login-box">
                        <form className="form-group">
                            <input type="text" placeholder="Username" id="user" name='username' required={true}/>
                            <input type="password" placeholder="Password" id="pass" name='password' required={true}/>
                            <button type="submit" className='btn btn-block btn-small btn-secondary'> Log in </button>
                        </form>

                        <div className="separate-or"> or </div>

                        <div className="alt-btns">
                            <div><a className="guest link" onClick={_=>history.push("/")}> Enter as Guest </a></div>
                            <div><a className="forgot-pass link" onClick={_=>history.push("/password-reset")}> Forgot password? </a></div>
                        </div>

                    </div>
                </div>
            </div>

            <div className='card signup-request-card auth-pg'>
                <div className='card-body'>
                    <p> Don't have an account? <a className="link" onClick={_=>history.push("/register")}>signup</a> </p>
                </div>
            </div>
        </div>
    );
}


export default Login;
