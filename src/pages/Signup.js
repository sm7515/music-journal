import React from 'react';
import SignupForm from '../components/SignupForm'

export default function Signup({ signUpFunction}) {
    return (
        <div>
            <SignupForm submitFunction={signUpFunction}/>
        </div>
    )
}