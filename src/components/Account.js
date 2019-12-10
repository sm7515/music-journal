import React,{useState,useEffect} from 'react';
import axios from 'axios';
import EdiText from 'react-editext'
import Avatar from 'react-avatar-edit'

export default function Account({ user, app}) {

    const currentUser = app.firebase_ && app.firebase_.auth().currentUser;
    let [uid, setUid] = useState("");
    let [username, setUsername] = useState("");
    let [preview,setPreview]=useState(null);
    let [src,setSrc]=useState("");
    let [profileimage, setProfileImage]=useState("")

    const queryUserprofile=(uid)=>{axios.get(`http://localhost:8888/user?query=${uid}`)
        .then(res => {
            // console.log(res)
            setUsername(res.data.username)
            setProfileImage(res.data.profileimage);
            setPreview(res.data.profileimage)
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(()=>{
        setUid(user.uid)
    }, [user])

    useEffect(()=>{
        uid && queryUserprofile(uid);
    },[uid])

    // console.log(app.firebase_&&app.firebase_.auth().currentUser)
    const onSave=(val)=>{
        console.log(val);
        axios.post(`http://localhost:8888/user/username`, {
            uid: uid,
            username: val,
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        setTimeout(function () {
            window.location.reload(true);
        }, 500);
    }

    const onClose=()=>{
        setPreview("");
    }

    const onCrop  = (preview)=> {
        // console.log(preview)
        setPreview(preview)
    }

    const onFileLoad=(image)=>{
        // console.log(image.name)
        setSrc(image.name)
        setPreview(image.name)
    }

    const onClick=()=>{
        // console.log(preview);
        preview&&axios.post(`http://localhost:8888/user/profileimage`,{
            uid:uid,
            profileimage:preview,
        })
            .then(res=>{
                console.log(res)
            })
            .catch(function (error) {
                console.log(error);
            });
        setTimeout(function () {
            window.location.reload(true);
        }, 500);
    }

    let pathName = window.location.pathname;

    return(
        <div className="use-account-page">
            <div className="profile-nav">
                {profileimage&&<img src={profileimage} alt="profileimage" />}
                <span>{username}</span>
                <a href="/userprofile/account" className={pathName ==="/userprofile/account"?"account-nav":""}>account</a>
                <a href="/userprofile/archive" className={pathName === "/userprofile/archive" ? "archive-nav" : ""}>archive</a>
            </div>
            <div className="account-page">
                <span className="avatar">
                    <Avatar
                        width={390}
                        height={295}
                        onFileLoad={image => onFileLoad(image)}
                        onCrop={image => onCrop(image)}
                        onClose={onClose}
                        src={src}
                        label={"UPLOAD PROFILE IMAGE"}
                        labelStyle={{color:"white"}}
                        className="box"
                    />
                    <button onClick={onClick}>Update</button>
                    {preview&&<img src={preview} alt="Preview" />}
                </span>

            <span className="user-userinfo">
                {username!=""&&
                <span className="user-username">
                <span className="username-text">USERNAME: </span>
                    <EdiText
                        type="text"
                        value={username}
                        onSave={val=>onSave(val)}
                    />
                </span>
                }
                {<span>
                    <span className="user-email">EMAIL: </span>
                    <span>{user.email}</span>
                </span>
                }
            </span>
            </div>
        </div>
    )
}