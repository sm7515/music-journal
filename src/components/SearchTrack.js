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
    let randomId=0;
    let [random,setRandom]=useState(false);
    let [randomResult,setRandomResult]=useState({});

    function generateRandomTrackId(){
        randomId=Math.floor(Math.random() * 8999999 + 1000000);
        console.log(randomId);
        return randomId;
    }

    function getRandomTrack() {
        randomId = generateRandomTrackId();
        axios.get(`http://localhost:8888/search/random?query=${randomId}`)
            .then(res => {
                // const result = res.data.data;
                console.log(res)

                if (res.data.error){
                    setError("Sorry, no random song for you today. Search a song please.");
                }
                else{
                    setRandomResult(res.data);
                    setRandom(true);
                }
            })
            .catch(err => {
                // console.log(err.response.data);
                setError("Sorry, no random song for you today.Search a song please.");
            })
    }

    function handleSearch(searchInput) {
        axios.get(`http://localhost:8888/search?query=${searchInput}`)
            .then(res=>{
                if(res.data.data.length===0){
                    setError("Sorry, we didn't find the song you're looking for.");
                }
                else{
                    const result = res.data.data;
                    setSearchResult(result[0])
                    setFinishSearching(true);
                }
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

    useEffect(()=>{
        error = ""
        setError(error)
        if(!random){
            randomResult=""
            setRandomResult(randomResult)
            getRandomTrack();
        }
    }, [random])

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
                <input type="submit"  />
            </form>
            {finishSearching &&searchResult&&
                <span className="search-musicPlayer" >
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
                finishSearching && searchResult && <MakePost track={searchResult} user={user}/>
            }
            {
                !error&&random && randomResult.album&& !finishSearching&&
                <span className="search-musicPlayer" >
                    <img className="songImg" src={randomResult.album.cover_medium} />
                    <span className="songInfo">
                        <span className="songTitle">{randomResult.title}</span>
                        <span className="singerName">{randomResult.artist.name}</span>
                        <ReactAudioPlayer
                            className="audio"
                            src={randomResult.preview}
                            controls />
                    </span>
                </span>
            }
            {
                !error &&random && !finishSearching && <MakePost track={randomResult} user={user} />
            }
        </div>
    )
}