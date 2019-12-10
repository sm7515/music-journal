import React from 'react';

export default function LoginForm({ submitFunction}){
    return(
        <div className="form-container-login" >
            <form className='login-form' onSubmit={(e)=> {submitFunction(e)}}>
                <div className="form-group">
                    <input type="email"
                        required
                        className="form-control"
                        placeholder='email'
                        name='loginEmail'
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className='form-label' htmlFor='loginEmail'>Email </label>
                </div>
                <div className="form-group">
                    <input type="password"
                        required
                        className="form-control"
                        placeholder='password'
                        name='loginPassword'
                    />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className='form-label' htmlFor='loginPassword'>Password </label>
                </div>
                <div className='login'>
                    <input type="submit" value="LOG IN"/>
                    <p>or</p>
                </div>
            </form>
        </div>
    )
}