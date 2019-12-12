import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';

export default function Archive({ user}) {

    let [uid, setUid] = useState("");
    let [posts,setPosts]=useState([]);
    let [newPosts,setNewPosts]=useState([]);
    let [done,setDone]=useState(false);
    let [update,setUpdate]=useState(false);
    let [profileimage, setProfileImage] = useState("")
    let [username, setUsername] = useState("");

    const queryUserprofile = (uid) => {
        axios.get(`https://musicjournal-api.herokuapp.com/user?query=${uid}`)
        .then(res => {
            // console.log(res)
            setUsername(res.data.username)
            setProfileImage(res.data.profileimage);
        })
        .catch(err => {
            console.log(err)
        })
    }

    const queryUserPost=(uid)=>{
        console.log(uid)
        uid && axios.get(`https://musicjournal-api.herokuapp.com/user/getAllPosts?query=${uid}`)
            .then(res=>{
                // console.log(res)
                posts = [];
                setPosts(posts);
                let data=res.data;
                for(let i=0;i<data.length;i++){
                    posts.push(data[i]);
                }
                setPosts(posts);
                setDone(true);
            })
            .catch(err=>{
                console.log(err)
            })
    }

    const handleAllPosts = (allPosts) => {
        for (let i = 0; i < allPosts.length; i++) {
            let d = convertTimestamp(allPosts[i].postDate.seconds);
            allPosts[i].postDate = d;
            newPosts.push(allPosts[i])
        }
        setNewPosts(newPosts);
        setUpdate(true);
    }

    function convertTimestamp(timestamp) {
        var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
            dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
            ampm = 'AM',
            time;
        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh == 0) {
            h = 12;
        }
        // ie: 2013-02-18, 8:35 AM	
        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
        return time;
    }

    useEffect(() => {
        setUid(user.uid)
    }, [user])

    useEffect(() => {
        uid && queryUserprofile(uid);
        uid && queryUserPost(uid);
    }, [uid])

    useEffect(()=>{
        posts&&handleAllPosts(posts)
        console.log(newPosts)
    },[posts])

    let pathName = window.location.pathname;

    const deletePost = (uid, item)=>{
        let trackId = item&&item.track.id;
        console.log(trackId)
        axios.post(`https://musicjournal-api.herokuapp.com/deletePost`,{
            uid:uid,
            trackId: trackId
        })
            .then(res=>console.log(res))
            .catch(err=>console.log(err))
        setTimeout(function () {
            window.location.reload(true);
        }, 500);
    }

    return (
        <div className="use-archive-page">
            <div className="profile-nav">
                {profileimage && <img src={profileimage} alt="profileimage" />}
                <span>{username}</span>
                <a href="/userprofile/account" className={pathName === "/userprofile/account" ? "account-nav" : ""}>account</a>
                <a href="/userprofile/archive" className={pathName === "/userprofile/archive" ? "archive-nav" : ""}>archive</a>
            </div>
            <div className="archive-page">
                {done&&newPosts.length!==0?newPosts.map((item,index)=>
                    <div key={index} className="individual-post">
                        <span className="postDate">{item.postDate}</span>
                        <button onClick={() => deletePost(uid, item)}>delete</button>
                        {item.postContent != "" &&
                            <span className="postContent">
                                <span className="qoute-before">“</span>
                                <span className="text">{item.postContent}</span>
                                <span className="qoute-after">”</span>
                            </span>}
                        <span className={item.postContent === "" ? 'musicPlayer-nocontent' : 'musicPlayer'}>
                            <img className="songImg" src={item.track.album.cover_medium} />
                            <span className="songInfo">
                                <span className="songTitle">{item.track.title}</span>
                                <span className="singerName">{item.track.artist.name}</span>
                                <ReactAudioPlayer
                                    className="audio"
                                    src={item.track.preview}
                                    controls />
                            </span>
                        </span>
                        <span className="like-section">
                            <span className="like">like</span>
                            <span className="like-num"  >{item.likes}</span>
                        </span>
                        <span className="comment-section">
                            <span className="comment-section comments">
                                {item.comments && item.comments.map((ele, num) => (
                                    <span key={num} className="each-comment">{ele}</span>
                                ))}
                            </span>
                        </span>
                        <div className="line"></div> 
                    </div>
                )
                    : <span>You have not post anything yet.</span>
                }
            </div>
        </div>
    )
}