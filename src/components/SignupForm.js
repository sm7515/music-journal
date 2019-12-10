import React from 'react';

export default function SignupForm({ submitFunction }) {
    return (
        <div className="form-container-login">
            <form className='login-form' onSubmit={(e) => { submitFunction(e) }}>
                <div className="form-group">
                    <input type="email"
                        required
                        className="form-control"
                        placeholder='email'
                        name='signupEmail'
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className='form-label' htmlFor='signupEmail'>Email </label>
                </div>
                <div className="form-group">
                    <input type="password"
                        required
                        className="form-control"
                        placeholder='password'
                        name='signupPassword'
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className='form-label' htmlFor='signupPassword'>Password </label>
                </div>
                <div className='signup'>
                    <input type="submit" value="SIGN UP" />
                </div>
                <span>Already have an account? 
                    <a href='/login'>Log In</a>
                    <p>or</p>
                </span>
            </form>
        </div>
    )
}