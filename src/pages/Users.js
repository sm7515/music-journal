import React,{useState,useEffect,createRef} from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';

export default function Users() {
    // console.log(window.location.pathname)
    let pathname = window.location.pathname.split('/');
    let uid = (pathname[2]);
    let [profileimage, setProfileImage] = useState("")
    let [username, setUsername] = useState("");
    let [update, setUpdate] = useState(false);
    let [done, setDone] = useState(false);
    let [posts, setPosts] = useState([]);
    let [newPosts, setNewPosts] = useState([]);
    let userposts = new Map();
    // console.log(uid)

    useEffect(()=>{
        queryUserprofile(uid);
        queryUserPost(uid);
    },[uid])

    useEffect(()=>{
        posts && handleAllPosts(posts)
        console.log(newPosts)
    },[posts])

    const queryUserprofile = (uid) => {
        axios.get(`http://localhost:8888/user?query=${uid}`)
            .then(res => {
                // console.log(res)
                setUsername(res.data.username)
                setProfileImage(res.data.profileimage);
            })
            .catch(err => {
                console.log(err)
            })
    }

    const queryUserPost = (uid) => {
        console.log(uid)
        uid && axios.get(`http://localhost:8888/user/getAllPosts?query=${uid}`)
            .then(res => {
                // console.log(res)
                posts = [];
                setPosts(posts);
                let data = res.data;
                for (let i = 0; i < data.length; i++) {
                    posts.push(data[i]);
                }
                setPosts(posts);
                setDone(true);
            })
            .catch(err => {
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

    const addLike = (uid, trackId, key) => {
        axios.post(`http://localhost:8888/addLike`, {
            uid: uid,
            trackId: trackId
        })
        let val = parseInt(userposts.get(key).value, 10);
        val += 1;
        userposts.get(key).value = val;
    }

    return (
        <div className="others-page">
            <div className="others-profile">
                {profileimage && <img src={profileimage} alt="profileimage" />}
                <span>{username}</span>
            </div>
            <div className="others-posts">
                {done && newPosts.length !== 0 ? newPosts.map((item, index) =>
                    <div key={index} className="individual-post">
                        <span className="postDate">{item.postDate}</span>
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
                            <button className="like" onClick={() => { addLike(uid, item.track.id, index) }}>like</button>
                            <input className="like-num" type='number' value={userposts.get(index) ? userposts.get(index).value : item.likes} readOnly ref={eachpost => userposts.set(index, eachpost)}></input>
                        </span>
                        <div className="line"></div>
                    </div>
                )
                    : <span>This user has not post anything yet.</span>
                }
            </div>
        </div>
    )
}