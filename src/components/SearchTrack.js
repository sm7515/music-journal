import React, { useState, useEffect, createRef} from 'react';
import MakePost from './MakePost';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';

export default function SearchTrack({user}){

    const searchStr = createRef();
    let [searchInput, setSearchInput] = useState("");
    let [searchResult,setSearchResult]=useState({});
    let [finishSearching,setFinishSearching]=useState(false);
    let [selected, setSelected]=useState(false);
    let [error,setError]=useState("");

    function handleSearch(searchInput) {
        axios.get(`http://localhost:8888/search?query=${searchInput}`)
            .then(res=>{
                const result = res.data.data;
                setSearchResult(result[0])
                setFinishSearching(true);
            })
            .catch(err=>{
                console.log(err.response.data);
                setError(err.response.data);
            })
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        setSearchInput(e.currentTarget.search.value);
        console.log("search input: ",e.currentTarget.search.value);
    }

    // const handleOnClick=()=>{
    //     setSelected(true);
    // }

    useEffect(() => {
        error=""
        setError(error)
        setFinishSearching(false);
        searchResult=[];
        setSearchResult(searchResult);
        searchInput != "" && handleSearch(searchInput);
        setSelected(false);
    }, [searchInput])

    useEffect(()=>{
        if (finishSearching){
            console.log(searchResult);
        }
    },[finishSearching])

    return (
        <div className="search-track">
            <form onSubmit={e => handleSubmit(e)} className="search-form">
                <input className="form-control" type="text" name="search" ref={searchStr} placeholder="Search a song..."/>
                <span className="bar"></span>
                <input type="submit" style={{display:"none"}} />
            </form>
            {finishSearching &&searchResult&&<span className="search-musicPlayer" >
                <img className="songImg" src={searchResult.album.cover_medium} />
                <span className="songInfo">
                    <span className="songTitle">{searchResult.title}</span>
                    <span className="singerName">{searchResult.artist.name}</span>
                    <ReactAudioPlayer
                        className="audio"
                        src={searchResult.preview}
                        controls />
                </span>
            </span>}
            {
                error && <span className="search-error">{error}</span>
            }
            {
                <MakePost track={searchResult} user={user}/>
            }
        </div>
    )
}