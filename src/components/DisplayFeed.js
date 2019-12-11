import React,{useState,useEffect,createRef} from "react";
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';

export default function DisplayFeed({user}) {

    let [allPosts,setAllPosts]=useState([]);
    const [doneQuery,setDoneQuery]=useState(false);
    const [doneUpdate,setDoneUpdate]=useState(false);
    let posts=new Map();

    const uid=user.uid;

    const getAllPost=()=>{
        axios.get(`http://localhost:8888/getpost`)
        .then(res=>{
            // console.log(res.data);
            if(doneQuery!=true){
                allPosts = [];
                setAllPosts(allPosts);
                res.data.forEach(element => {
                    allPosts.push(element);
                });
                setAllPosts(allPosts);
                setDoneQuery(true);
            }
            // console.log(allPosts)
        })
        .catch(err=>{
            console.log(err);
        })
    }

    const handleAllPosts = (allPosts)=>{
        for(let i=0;i<allPosts.length;i++){
            let d = convertTimestamp(allPosts[i].postDate.seconds);
            allPosts[i].postDate=d;
        }
        setDoneUpdate(true);
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

    const refreshPage=()=>{
        window.location.reload(true);
    }

    useEffect(()=>{
        getAllPost();
        allPosts.length != 0 && handleAllPosts(allPosts);
        console.log(allPosts)
        // console.log(doneQuery)
    }, [doneQuery])

    const addLike=(uid,trackId,key)=>{
        axios.post(`http://localhost:8888/addLike`,{
            uid:uid,
            trackId: trackId
        })
        let val=parseInt(posts.get(key).value,10);
        val+=1;
        posts.get(key).value=val;
    }

    return(
        <div className="feed-section">
            <button className="refresh" onClick={refreshPage}>refresh</button>
        {
            doneUpdate && allPosts.map((item,key)=>(
                <div key={key} className="individual-post" >
                    <span className="user-info">
                        <img src={item.user.profileimage} />
                    </span>
                    <span className="post-info">
                        <span className="name-date">
                            <span className="name"><a href={uid === item.user.uid ?`/userprofile/archive`: `/users/${item.user.uid}`}>{item.user.username}</a></span>
                            <span className="postDate">{item.postDate}</span>
                            {item.postContent!=""&&
                            <span className="postContent">
                                <span className="qoute-before">“</span>
                                <span className="text">{item.postContent}</span>
                                <span className="qoute-after">”</span>
                            </span>}
                        </span>  
                        <span className={item.postContent === "" ?'musicPlayer-nocontent':'musicPlayer'}>
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
                            <button className="like" onClick={() => { addLike(item.user.uid, item.track.id,key) }}>like</button>
                            <input className="like-num" type='number' value={posts.get(key) ? posts.get(key).value: item.likes} readOnly ref={eachpost => posts.set(key, eachpost)}></input>
                        </span>
                        <div className="line"></div> 
                    </span> 
                </div>
            ))
        }
        </div>
    )
}