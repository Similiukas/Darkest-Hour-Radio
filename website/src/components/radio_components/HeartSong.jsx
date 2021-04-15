import { useState, useEffect } from 'react';
import pixels from "../../pixels.json";

function parseMetadata(data){
    // Fuck regex, hate it, just burn, just fuck that. Would be nicer to add another capturing group which catches $live$ but noo, regex has to suck >:C
    if (data.slice(-6) === "$live$") data = data.slice(0, -7);
    let parsedData = data.match("(.+) - (.+) #(.+)") ?? data.match("(.+) - (.+)");  // Group 3 is missing (no added album or MBID)
    return parsedData[1] + " " + parsedData[2];
}
// https://nameless-citadel-71535.herokuapp.com/song
async function getHearts(songName){
    return fetch(`https://nameless-citadel-71535.herokuapp.com/song/${songName}`, {
        mode: "cors",
        method: "GET"
    })
    .then(res => { if (res.ok) return res.text() })
    .catch(err => console.error("server", err.message));
}

function postHearts(songName){
    fetch(`https://nameless-citadel-71535.herokuapp.com/song/${songName}`, {
        mode: "cors",
        method: "POST"
    })
    .catch(err => console.log("Server err", err.message));
}

let lastSong = null;

const HeartSong = ({ templateRatio, currentSong }) => {
    const width = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.width : null;
    const height = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.height : null;

    const marginLeft = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.marginLeft : null;
    const marginTop = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.marginTop : null;

    const [active, setActive] = useState(false);
    const [hearts, setHearts] = useState("0");

    useEffect(() => {
        if (currentSong && currentSong !== "" && currentSong !== "ad"){
            if (active){
                console.log("User hearted this song", lastSong);
                setActive(false);
                postHearts(lastSong);
            }
            lastSong = parseMetadata(currentSong);
            getHearts(lastSong)
            .then(result => { if (result) setHearts(result) })
            .catch(err => console.error("Error getting song hearts", err));
        }
    }, [currentSong]);

    return (
        <div className="heart-song" onClick={() => setActive(!active)} style={{
            width: width,
            height: height,
            marginLeft: marginLeft,
            marginTop: marginTop
        }}>
            <span className={`heart ${active ? "active" : ""}`}>&hearts;</span>
            <span className="amount">{parseInt(hearts) + active}</span>
        </div>
    )
}

export default HeartSong
