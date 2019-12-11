import React,{useEffect,useState} from "react";
import axios from 'axios';

export default function UserProfileNavBar({user}) {

    const uid = user.uid;
    let [username, setUsername] = useState("");
    let [profileimage,setProfileImage]=useState('');

    const queryUserprofile = (uid) => {
        uid && axios.get(`https://musicjournal-api.herokuapp.com/user?query=${uid}`)
        .then(res => {
            // console.log(res)
            setUsername(res.data.username)
            // setProfileImage(res.data.profileimage);
            setProfileImage(res.data.profileimage)
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(()=>{
        queryUserprofile(uid);
    }, [user])

    return (
        <div className='profile-nav-page'>
            {user&&
            <span className="profile-info">
                <img src={profileimage} className="profileimage"/>
                <span>{username}</span>
            </span>}
            
            {user&&
            <span className="profile-links">
                <a href='/userprofile/archive'>archive</a>
                <a href='/userprofile/account'>account</a>
            </span>}
        </div>
    )
}