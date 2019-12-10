import React from 'react';
import UserProfileNavBar from '../components/UserProfileNavBar';

export default function UserProfile({user}) {
    return(
        <div>
            <UserProfileNavBar user={user}/>
        </div>
    )
}