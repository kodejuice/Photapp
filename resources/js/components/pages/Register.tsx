import React from 'react';
import { useHistory } from "react-router-dom";
import '../styles/auth-page.scss';


const Register: React.FC<{}> = () => {
    const history = useHistory();

    return (
        <div>
            <div className='card register-card auth-pg'>
                <div className="card-body">
                    <div className="brand-title">
                        <h1 className="card-title"></h1>
                    </div>

                    <div className="login-box">
                        <form className="form-group" onSubmit={_=>_}>
                            <input type="email" placeholder="Email" id="email" name='email' required={true}/>
                            <input type="text" placeholder="Full name" id="name" name='full_name' />
                            <input type="text" placeholder="Username" id="user" name='username' required={true}/>
                            <input type="password" placeholder="Password" id="pass" name='password' required={true}/>
                            <button type='submit' className='btn btn-block btn-small btn-secondary' disabled={!true}> Sign up </button>
                        </form>

                        <div className="alt-btns">

                        </div>

                    </div>
                </div>
            </div>

            <div className='card signup-request-card auth-pg'>
                <div className='card-body'>
                    <p> Have an account? <a className="link" onClick={_=>history.push("/login")}>Log in</a> </p>
                </div>
            </div>
        </div>
    );

}


export default Register;
