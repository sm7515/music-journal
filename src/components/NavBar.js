import React,{useEffect,useState} from "react";
import axios from 'axios';

export default function NavBar({ loggedin, logoutFunction, user, app }) {

    let [username,setUsername]=useState("");
    const currentUser = app.firebase_ && app.firebase_.auth().currentUser;
    // console.log(currentUser)
    useEffect(()=>{
        user.uid && queryUser(user.uid)
    }, [user, username])
    
    const queryUser = (uid)=>{
        axios.get(`https://musicjournal-api.herokuapp.com/user?query=${uid}`)
            .then(res=>{
                // console.log(res)
                if (res.data ==="No such user!"){
                    axios.post(`https://musicjournal-api.herokuapp.com/user`, {
                        uid: currentUser.uid,
                        email: currentUser.email
                    })
                        .then(res => {
                            setUsername(res.data.username)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                else 
                    setUsername(res.data.username)
            })
            .catch(err=>{
                console.log(err)
            })
    }
    // console.log(window.location.pathname)
    let pathName = window.location.pathname;
    return (
        <header className='navbar'>
            <nav className='navbar-item'>
                {!loggedin && <a href='/login' className={pathName ==="/login"?"login-nav":"a"}>LOG IN</a>}
                {!loggedin && <a href='/signup' className={pathName === "/signup" ? "signup-nav" : "a"}>SIGN UP</a>}
                {loggedin && 
                    <div className={!pathName.includes( "userprofile") ? "user-nav-item" : "user-nav-hide"} >
                        <img src="https://img.icons8.com/material-outlined/48/ffffff/user-male-circle.png"></img>
                    <a href='/userprofile' className={ "user-nav" } >{username}</a>
                    </div>
                }
                {
                    loggedin && <a href='/feed' 
                        className={pathName !== "/feed" && pathName !== "/" && pathName !== "/login" && pathName !== "/signup"? "home-nav" : "home-nav-hide"}
                    >HOME</a>
                }
                {loggedin && <a onClick={() => { logoutFunction() }} href='/login' className="a">LOG OUT</a>}
            </nav>
        </header>
    )
}