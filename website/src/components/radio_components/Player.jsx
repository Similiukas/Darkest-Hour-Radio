import { useState, useEffect } from 'react';
import { useDidMount } from '../hooks/EffectExceptFirst';
import defaultPhoto from "../../images/logo-min.png";
import pixels from "../../pixels.json";
import { Range, Direction, getTrackBackground } from "react-range";
import PlayerHUD from "./PlayerHUD";

/**
 * Searches songs (releases) and returns all matched songs JSON
 * @param {String} artist Artist name string
 * @param {String} song Song name string
 */
async function searchRecordings(artist, song){
    let recordings = await fetch(`https://musicbrainz.org/ws/2/recording/?query=artist:${artist} AND recording:${song}&fmt=json`)
    let recordingsJSON = await recordings.json();
    return recordingsJSON;
}

/**
 * Filters radios and playlist albums (releases) and returns best fit release group MBID
 * @param {String} artist Artist name string
 * @param {JSON} recordings Recordings JSON
 */
function filterRadios(artist, recordings){
    try{
        var backup = recordings[0]["releases"][0]["release-group"]["id"];
    } catch (error){
        console.error("Error in filtering radios (getting backup)", error);
        return "NONE"   // Failed to find a backup
    }
    try {
        for (let recordingIndex = 0; recordingIndex < recordings.length; recordingIndex++) {
            const record = recordings[recordingIndex];
            for (let releaseIndex = 0; releaseIndex < record["releases"].length; releaseIndex++) {
                const release = record["releases"][releaseIndex];
                console.log(release);
                if (release["artist-credit"]?.[0]["name"].toLowerCase() === "various artists"){
                    console.log("Found radio")
                    continue;
                }
                else if (release["artist-credit"]?.[0]["name"].toLowerCase() === artist.toLowerCase()){
                    console.log("Right artist");
                    return release["release-group"]["id"];
                }
            }
        }
        return backup;
    } catch (error) {
        console.error("Error in filtering radios (looking through recordings)", error);
        return backup
    }
}

/**
 * Searches album groups (release-group) and returns the first one's ID
 * @param {String} artist Artist name string
 * @param {String} album Album name string
 */
async function searchRelease(artist, album){
    let release = await fetch(`https://musicbrainz.org/ws/2/release-group/?query=artist:${artist} AND release:${album}&fmt=json`);
    let releaseJSON = await release.json();
    return releaseJSON["release-groups"][0]["id"];
}


const Player = ({ templateRatio, currentSong, listenerCount, setLive, togglePlay, volumeChange, timeoutReached, pastRecordData }) => {
    const width = window.innerWidth > 1025 ? templateRatio * pixels.Player.width - 2 * templateRatio * pixels.Player.width * pixels.Player.MARGIN_X : null;
    const height = window.innerWidth > 1025 ? templateRatio * pixels.Player.height - 2 * templateRatio * pixels.Player.height * pixels.Player.MARGIN_Y : null;
    const marginLeft = window.innerWidth > 1025 ? templateRatio * pixels.Player.width * pixels.Player.MARGIN_X : null;
    const marginTop = window.innerWidth > 1025 ? templateRatio * (pixels.templateHeight - pixels.Player.height) + templateRatio * pixels.Player.height * pixels.Player.MARGIN_Y : null;

    const [songName, setSongName] = useState("Loading...");
    const [artistName, setArtistName] = useState("UwU");    // UwU
    const [coverPhotoUrl, setCoverPhotoUrl] = useState(defaultPhoto);
    const [playButtonText, setPlayButtonText] = useState("play_circle")
    const [volume, setVolume] = useState([0.4]);

    /**
     * Parses data from Icecast source and splits into artist, title, mbid and checks if dj has connected
     * @param {String} data title of the Icecast source
     * @returns Returns the parsed data as groups (artist, title, album)
     */
    function parseMetadata(data){
        if (data.slice(-6) === "$live$"){
            console.log("We are live");
            setLive(true);
            data = data.slice(0, -7);
        }   // Fuck regex, hate it, just burn, just fuck that. Would be nicer to add another capturing group which catches $live$ but noo, regex has to suck >:C
        else setLive(false);
        let parsedData = data.match("(.+) - (.+) #(.+)");
        if (parsedData === null)    return data.match("(.+) - (.+)");   // Group 3 is missing (no added album or MBID)
        return parsedData;
    }

    /**
     * Adds album cover art to HTML
     * @param {MBID} MBID Release MBID from musicbrainz
     * @param {boolean} group If true, looking for release group. If false -> just for release
     */
    async function addCoverArt(MBID, group){
        try {
            let img = await fetch(`https://coverartarchive.org/release${group ? "-group/" : "/"}${MBID}`);
            var imgJSON = await img.json();
            setCoverPhotoUrl(imgJSON.images[0].thumbnails["small"]);
        } catch (error) {
            setCoverPhotoUrl(defaultPhoto);
        }
    }

    useEffect(() => {
        console.log(`CurrentSong [${currentSong}] ${currentSong === ""}`);
        if (currentSong !== null && currentSong !== ""){
            async function updateCoverArt(song){    
                let songInfo = parseMetadata(song);
                setSongName(songInfo[2]);
                setArtistName(`By ${songInfo[1]}`);
                console.log(`Song changed to: ${songInfo}`);
                try {
                    if (songInfo.length === 3){
                        // Search for recording by artist and recoding
                        // Search for release from recording IDs (filtering radios)
                        // Add cover art from filtered recording or switch to default
                        let recordings = await searchRecordings(songInfo[1], songInfo[2]);
                        let MBID = filterRadios(songInfo[1], recordings["recordings"]);
                        MBID === "NONE" ? setCoverPhotoUrl(defaultPhoto) : addCoverArt(MBID, true);
                    }   // TODO Need to check whether this is actually correct once more
                    else if ((songInfo[3].match(/.-./g) || []).length >= 2) {   // If album or MBID has more than 2 '-', then it's MBID
                        addCoverArt(songInfo[3], false);    // Search for cover art by release MBID
                    }
                    else {
                        // Search for release by artist and album name
                        // Search for cover art by release
                        let MBID = await searchRelease(songInfo[1], songInfo[3]);
                        addCoverArt(MBID, true);
                    }
                } catch (error) {
                    console.error(`There was an error trying to get cover art for this [${songInfo}] audio.\nSwitching to default photo\nError:`, error);
                    setCoverPhotoUrl(defaultPhoto);
                }
            }
            updateCoverArt(currentSong);
        }
        else if (currentSong === "") {    // Initially it's null so not changing anything and default values are set
            setSongName("Temporarily offline");
            setArtistName("");
            setCoverPhotoUrl(defaultPhoto);
        }
    }, [currentSong]);

    // useEffect except first render
    useDidMount(() => {
        setPlayButtonText("pause_circle");
        if(pastRecordData){
            console.log("Setting to recording data");
            setSongName(pastRecordData["name"]);
            setArtistName("");
            setCoverPhotoUrl(defaultPhoto);
        }
    }, [pastRecordData]);

    return (
        <div id="player" style={{
            width: width,
            height: height,
            marginLeft: marginLeft,
            marginTop: marginTop
        }}>
            <div id="player-controls">
                <span
                    className="control play material-icons md-48"
                    onClick={() =>{
                        togglePlay(playButtonText === "play_circle");
                        setPlayButtonText(playButtonText === "play_circle" ? "pause_circle" : "play_circle");
                }}>
                        {timeoutReached ? "play_circle" : playButtonText}
                </span>   {/*<!-- Hide in desktop-->*/}

                <div className="song info">
                    <span className={`name ${songName.length > 15 ? "small" : ""}`}>{songName}</span>
                    <span className={`artist ${artistName.length > 15 ? "small" : ""}`}>{artistName}</span>
                </div>
                
                { window.innerWidth < 1025 &&
                    <div className="control sound">
                        <Range
                            direction={Direction.Up}
                            min={0}
                            max={1}
                            step={0.1}
                            values={volume}
                            onChange={(e) => { setVolume(e); volumeChange(e[0]); }}
                            renderTrack={({ props, children }) => (
                                <div className="volume-slider-track">
                                <div
                                    className="volume-slider-track-inner"
                                    ref={props.ref}
                                    style={{
                                    background: getTrackBackground({
                                        values: volume,
                                        colors: ['#548BF4', '#ccc'],
                                        min: 0,
                                        max: 1,
                                        direction: Direction.Up,
                                        rtl: false
                                    })}}
                                >
                                    {children}
                                </div>
                                </div>
                            )}
                            renderThumb={({ props, isDragged }) => (
                                <div className="volume-slider-thumb" {...props}>
                                    <div className="volume-slider-thumb-inner"
                                        style={{
                                            backgroundColor: isDragged ? '#548BF4' : '#CCC'
                                        }}
                                    />
                                </div>
                            )}
                        />
                    </div>
                }
            </div>
            
            { window.innerWidth < 1025 &&
                <PlayerHUD 
                    templateRatio={templateRatio}
                    listenerCount={listenerCount}
                    currentSong={currentSong}
                />
            }
        
            {/* TODO: Above the photo there's a bar showing how much of a recording has passed and left */}
            <img id="cover-art" src={coverPhotoUrl} alt="Album cover" />
        </div>
    )
}

export default Player
