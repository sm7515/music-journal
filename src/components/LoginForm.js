import React from 'react';

export default function LoginForm(){
    return(
        <div className="login-form">
            <form className='login-form'>
                <div className="form-group">
                    <input type="email"
                        required
                        className="form-control"
                        placeholder='email'
                        name='email'
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className='form-label' for='email'>Email </label>
                </div>
                <div className="form-group">
                    <input type="password"
                        required
                        className="form-control"
                        placeholder='password'
                        name='password'
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className='form-label'>Password </label>
                </div>
                <div className='reg-log'>
                    <a href='http://localhost:8888/login'>Login with Spotify</a>
                    <a href='/register'>register</a>
                </div>
            </form>
        </div>
    )
}