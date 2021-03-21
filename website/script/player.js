getInfo();
var timer = setInterval(getInfo, 14000);
var currentSong = "";
var offline = true;
var myTimeout = -1;
var visualizationInitialized = false;
const defaultPhoto = "images/logo-min.png";
var weAreLive = false;

// TODO Need to minimize the new template photo

async function getInfo(){
    try {
        var info = await fetch(`https://stream.dhradio.tk/status-json.xsl?_=${Math.random()}`);
        var json = await info.json();
        let source = Array.isArray(json.icestats.source) ? json.icestats.source[0] : json.icestats.source;
        document.getElementById("listener-count").textContent = source["listeners"].toString().padStart(2, '0');
        if (currentSong != source.title){         // Would need to add to check if transitioning from pls to mopidy or to live (naming transitioning files simply)
            offline = false;
            if (source.title != "undefined" || source.title != "Unknown" || source.title != "$live$"){
                currentSong = source.title;
                updateCoverArt(decodeURI(currentSong));     // TODO I dunno if decodeURI is actually needed tho
            }
    
        }
    } catch (err) {
        console.error("Something is WRONG", err);
        document.getElementsByClassName("name")[0].textContent = "Temporarily offline";
        document.getElementsByClassName("artist")[0].textContent = "";
        document.getElementById("cover-art").src = defaultPhoto;
        document.getElementById("listener-count").textContent = "00";
        offline = true;     // Change to backup image and reset artist text
    }
}

/**
 * Changing audio sound level
 * @param {DOM element} element which calls the function
 * @param {Boolean} increase boolean to increase or decrease sound (only on desktop)
 */
function volumeChange(element, increase){
    let audio = document.getElementById("player-test");
    if (element.id == "volume-slider"){
        audio.volume = element.value / 100;
    }
    else if (increase == true){
        audio.volume = (audio.volume >= 0.85) ? 1 : audio.volume + 0.1;
    }
    else{
        audio.volume = (audio.volume <= 0.15) ? 0 : audio.volume - 0.1;
    }
    setSound(audio.volume);
}

/**
 * Turning off and on overlay
 * @param {string} overlayType Type of overlay (either timeout or other)
 */
function toggleOverlay(overlayID){
    console.log("toogle overlay", overlayID);
    let element = document.getElementsByClassName("overlay")[overlayID];
    element.style.display = (element.style.display == "none") ? "block" : "none";

    if (overlayID == 2 && !document.getElementById("player-test").paused){    // Simulating player pause
        if (window.innerWidth < 1025){
            togglePlay(document.getElementsByClassName("control play")[0], "phone");
        }
        else {
            togglePlay(document.getElementsByClassName("pause")[0], "pause");
            document.getElementsByClassName("boombox-buttons")[0].style.pointerEvents = "none";    // Not letting trigger togglePlay while overlay is on
        }
    }
    else if (overlayID == 2){                                                 // Simulating player play
        if (window.innerWidth < 1025) {
            togglePlay(document.getElementsByClassName("control play")[0], "phone");
        }
        else {
            togglePlay(document.getElementsByClassName("play")[0], "play");
            document.getElementsByClassName("boombox-buttons")[0].style.pointerEvents = "auto";
        }
    }
}


function toggleShow(showID){
    let element = document.getElementsByClassName("podcast-show")[showID];
    for (const element of document.getElementsByClassName("podcast-show")) {
        // element.style.display = "none";
        element.classList.remove("active");
    }
    // element.style.display = "block";
    element.classList.add("active");
    // flkty.resize();
    console.log("TOGGLED", showID);
    carResize(showID);
}

/**
 * Main function turning off and on the radio
 * @param {DOM element} element DOM element which turns on/off the player
 * @param {String} boomboxButton If from desktop, signalizing which button was pressed
 */
function togglePlay(element, boomboxButton){

    // var players = document.getElementsByClassName("players");
    // let a = 0;
    // let v = setInterval(sp, 1000);
    // function sp(){
    //     players[a].firstChild.src =`https://dhrstream.ml/playlist.ogg?_=${Math.random()}`;
    //     players[a].load();
    //     players[a++].play();
    //     if (a == 25) clearInterval(v);
    // };

    // for (const player of players) {
    //     player.firstChild.src = `https://dhrstream.ml/playlist.ogg?_=${Math.random()}`;
    //     player.load();
    //     player.play();
    // }
    // TODO Make play and pause fade in and out very quickly (Something like Spotify)
    var player = document.getElementById("player-test");
    if (!offline && player.paused && boomboxButton != "pause"){
        // Putting random numbers makes a different url so audio doesn't buffer and always loads new content
        player.firstChild.src = `https://stream.dhradio.tk/playlist.ogg?_=${Math.random()}`;
        player.load();
        player.play();
        // Starting visualizations only once
        if (!visualizationInitialized) {
            player.volume = .4;     // On first start, reducing the volume
            setSound(player.volume);
            if (navigator.userAgent.indexOf("Firefox") > - 1){  // Turning on background visualization only for Mozilla
                startVisualization();
            }
            visualHUD();
            visualizationInitialized = true;
        }
        
        // Dealing with GUI
        if (boomboxButton == "phone"){
            element.textContent = "pause_circle";
        }
        else {
            element.classList.add("active");
            document.getElementsByClassName("button pause active")[0].classList.remove("active");
        }
        
        myTimeout = setTimeout(toggleOverlay, 2.1 * 60 * 60 * 1000, 2);  // Creating a timeout for 2.1 hours 2.1 * 60 * 60 * 1000
    } else if (!player.paused && boomboxButton != "play"){
        player.pause();
        if (myTimeout != -1)    clearTimeout(myTimeout)                     // Clearing the timeout overlay
        // Dealing with GUI
        if (boomboxButton == "phone"){
            element.textContent = "play_circle";
        }
        else {
            element.classList.add("active");
            document.getElementsByClassName("button play active")[0].classList.remove("active");
        }
    }
    else console.error("Something is wrong");
}

async function updateCoverArt(song){
    console.log(`Song changed to: ${song}`);
    let nameDOM = document.getElementsByClassName("name")[0];
    let artistDOM = document.getElementsByClassName("artist")[0];

    let songInfo = parseMetadata(song);     // FIXME Broadcasting silence sets song to undefined so need to check that and ignore it
    nameDOM.textContent = songInfo[2];
    artistDOM.textContent = `By ${songInfo[1]}`;
    console.log(songInfo);
    // Reducing font size if title is long
    songInfo[2].length > 15 ? nameDOM.classList.add("small") : nameDOM.classList.remove("small");
    songInfo[1].length > 20 ? artistDOM.classList.add("small") : artistDOM.classList.remove("small");
    // try {
    //     if (songInfo.length == 3){
    //         console.log("Only artist and title");
    //         // Search recoding by artist and recoding
    //         // Search for release from recording IDs
    //         // Search for cover art by filtered release
    //         let recordings = await searchRecordings(songInfo[1], songInfo[2]);
    //         let MBID = filterRadios(songInfo[1], recordings["recordings"]);
    //         if (MBID == "NONE"){
    //             document.getElementsByTagName("img")[1].src = defaultPhoto;
    //         }
    //         else{
    //             addCoverArt(MBID, true);
    //         }
    //     }
    //     else if ((songInfo[3].match(/.-./g) || []).length >= 2) {   // If album or MBID has more than 2 '-', then it's MBID
    //         console.log("MBID: " + songInfo[3].slice(1));
    //         // Search for cover art by release MBID
    //         addCoverArt(songInfo[3].slice(1), false);
    //     }
    //     else {      // FIXME Say So - Japanese Version (Single) This is NOT MBID soo In love with E-Girl is also
    //         console.log("Album: " + songInfo[3].slice(1));
    //         // Search for release by artist and album name
    //         // Search for cover art by release
    //         let MBID = await searchRelease(songInfo[1], songInfo[3].slice(1));
    //         addCoverArt(MBID, true);
    //     }
    //     // else console.error("Uhm, something went wrong. Most probably the DJ or Admin set the audio metadata wrong. Sorry :/", songInfo);
    // } catch (error) {
    //     console.error(`There was an error trying to get cover art for this [${songInfo}] audio.\nSwitching to default photo`);
    //     document.getElementById("cover-art").src = defaultPhoto;
    // }
}


// (.+) - (.+) #(.+) ((\$live\$)?)+
// (.+) - (.+) (#.+[^\\$live\\$])(?: \\$live\\$)?
/**
 * Parses data from Icecast source and splits into artist, title, mbid and checks if dj has connected
 * @param {String} data title of the Icecast source
 * @returns Returns the parsed data as groups (artist, title, album)
 */
function parseMetadata(data){
    if (data.slice(-6) === "$live$"){
        console.log("We are live");
        document.querySelector('.live-indicator-blink').classList.add("on");
        weAreLive = true;
        data = data.slice(0, -7);
    }   // Fuck regex, hate it, just burn, just fuck that. Would be nicer to add another capturing group which catches $live$ but noo, regex has to suck >:C
    else {
        weAreLive = false;
        document.querySelector('.live-indicator-blink').classList.remove("on");
    }
    let parsedData = data.match("(.+) - (.+) #(.+)");
    if (parsedData === null)    return data.match("(.+) - (.+)");   // Group 3 is missing (no added album or MBID)
    return parsedData;
}

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
        // var backup = recordings[0].releases[0].id;
        var backup = recordings[0]["releases"][0]["release-group"]["id"];
    } catch (error){
        console.error(error);
        return "NONE"
    }
    try {
        for (let recordingIndex = 0; recordingIndex < recordings.length; recordingIndex++) {
            const record = recordings[recordingIndex];
            for (let releaseIndex = 0; releaseIndex < record["releases"].length; releaseIndex++) {
                const release = record["releases"][releaseIndex];
                console.log(release);
                if (release["artist-credit"]?.[0]["name"].toLowerCase() == "various artists"){
                    console.log("Found radio")
                    continue;
                }
                else if (release["artist-credit"]?.[0]["name"].toLowerCase() == artist.toLowerCase()){
                    console.log("Right artist");
                    return release["release-group"]["id"];
                }
            }
        }
        return backup;
    } catch (error) {
        console.error(error);
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

/**
 * Adds album cover art to HTML
 * @param {MBID} MBID Release MBID from musicbrainz
 * @param {boolean} group If true, looking for release group. If false -> just for release
 */
async function addCoverArt(MBID, group){
    var photo;
    try {
        let img = await fetch(`https://coverartarchive.org/release${group ? "-group/" : "/"}${MBID}`);
        var imgJSON = await img.json();
        photo = imgJSON.images[0].thumbnails["small"];
    } catch (error) {
        photo = defaultPhoto;
    }
    document.getElementsByTagName("img")[1].src = photo;
}


function clickedpod(){
    // Basically then has a confirmation if you want to listen to this one
    console.log("pod", new Date().getSeconds());
}