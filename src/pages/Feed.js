import React from 'react';
import SearchTrack from '../components/SearchTrack';
import DisplayFeed from "../components/DisplayFeed";

export default function Feed({ user}) {
    // console.log(user)
    return(
        <div className="feed-page">
            <SearchTrack user={user}/>
            <DisplayFeed user={user}/>
        </div> 
    )
}