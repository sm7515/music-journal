import React,{useState,useEffect} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

export default function GetTrack(){

    const [loggedIn,setLoggedIn]=useState(false);
    const [nowPlaying, setNowPlaying] = useState({
        name: 'Not Checked', albumArt: ''
    });
    const [clicked, setClick]=useState(false);

    const getNowPlaying=()=>{
        spotifyApi.getMyCurrentPlaybackState()
            .then((response) => {
                console.log(response)
                response && setNowPlaying({
                    name: response.item.name,
                    albumArt: response.item.album.images[0].url
                });
            })
        }

    useEffect(()=>{
        const params = getHashParams();
        const token = params.access_token;
        if (token) {
            spotifyApi.setAccessToken(token);
        }
        setLoggedIn(token ? true : false);
    }, [loggedIn])

    return (
        <div>
            <div>
                <h2>Now Playing: {nowPlaying.name}</h2>
            </div>
            <div>
                <img src={nowPlaying.albumArt} />
            </div>
            <div>
                {loggedIn &&
                    <button onClick={() => getNowPlaying()}>
                    Check Now Playing
                    </button>
                }
            </div>
        </div>
    )
}

const getHashParams=()=> {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        e = r.exec(q);
    }
    return hashParams;
}