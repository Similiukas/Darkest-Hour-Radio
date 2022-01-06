import { useState, useRef, useEffect } from 'react'
import pixels from "../../pixels.json";
import BoomboxButtons from "./BoomboxButtons";
import HUD from "./HUD";
import LiveIndicator from "./LiveIndicator";
import HeartSong from "./HeartSong";
import Player from "./Player";
import radioTemplate from "../../images/desktop-template-3-min.png";

let offline = true;

const Radio = ({ overlayType, toggleOverlay, toggleTimeout, audio, audioToggle, audioVolume, pastRecordData, stopCloud }) => {
    const [listenerCount, setListenerCount] = useState("00");
    const [currentSong, setCurrentSong] = useState(null)
    const [templateRatio, setTemplateRatio] = useState(0);
    const [audioVolumeUI, setAudioVolumeUI] = useState(0.4);            // For setting the height of HUD sound bars
    const [weAreLive, setWeAreLive] = useState(false);
    const [timeoutReached, setTimeoutReached] = useState(false);        // For enabling/disabling boombox buttons pointer events
    const templateRef = useRef(null);   // Ref for template image div

    function togglePlay(startPlaying){
        console.log("toggle play?", startPlaying, offline, audio);

        if(pastRecordData && audio.paused === startPlaying){
            audioToggle(false);    // Toggling audio of recording even if we are offline
        }
        else if(!offline && audio.paused === startPlaying){   // If not offline button only starts or pauses (just for PC buttons)
            audioToggle(true);
            toggleTimeout();
        }
        else console.error("We are probably offline?", offline, audio, startPlaying);
    }

    function volumeChange(increase){
        if (typeof increase === 'boolean'){
            audioVolume(increase);
            setAudioVolumeUI(audio.volume);
        }
        else audio.volume = increase;
    }

    // Hook for calling radio server for info
    useEffect(() => {
        const getInfo = async () =>{
            if (pastRecordData)  return;
            try {
                var info = await fetch(`https://stream.dhradio.tk/status-json.xsl?_=${Math.random()}`);
                var json = await info.json();
                let source = Array.isArray(json.icestats.source) ? json.icestats.source[0] : json.icestats.source;
                setListenerCount(source["listeners"].toString().padStart(2, '0'));
                if (currentSong !== source.title){   // If changed back to live, immediately changing song info to current live
                    offline = false;
                    if (source.title === "radio-ad-1"){
                        setCurrentSong("ad");
                    }
                    else if (source.title !== undefined && source.title !== "Unknown" && source.title.trim() !== "$live$"){
                        setCurrentSong(source.title);
                    }
                }
            } catch (err) {
                console.error("Something is WRONG", err);
                setListenerCount("00");
                setCurrentSong("");
                offline = true;     // Change to backup image and reset artist text
            }
        };
        if(pastRecordData){
            setListenerCount(pastRecordData["listeners"]);
            setCurrentSong(null);   // This way, Player.jsx doesn't do anything with current song and when changing back to live, immediately updating to current live song
        }
        getInfo();  // Gets called on load
        const timer = setInterval(getInfo, 12000);
        return () => { clearInterval(timer); }
    }, [currentSong, pastRecordData]);

    // Timeout useEffect hook for pausing/playing the audio when timeout is reached/ended (also, notifies boombox buttons to change)
    useEffect(() => {
        if (overlayType === "timeout start"){
            togglePlay(false);
            setTimeoutReached(true);
        }
        else if (overlayType === "timeout end"){
            togglePlay(true);
            setTimeoutReached(false);
        }
    }, [overlayType]);

    // Hook placing UI objects based on template size 
    useEffect(() => {
        setTemplateRatio(templateRef.current.clientWidth / pixels.templateWidth);    // Calling initially    
        function resizing() { setTemplateRatio(templateRef.current.clientWidth / pixels.templateWidth); }
        window.addEventListener('resize', resizing);    // Calling after window is resized
        // Cleaning up to prevent memory leak (https://www.pluralsight.com/guides/re-render-react-component-on-window-resize)
        return _ => { window.removeEventListener('resize', resizing); }
    }, [templateRatio]);

    return (
        <div id="radio">
            { window.innerWidth > 1025 &&
            <>
                <BoomboxButtons
                    templateRatio={templateRatio}
                    togglePlay={togglePlay}
                    volumeChange={volumeChange}
                    toggleOverlay={toggleOverlay}
                    timeoutReached={timeoutReached}
                    pastRecordData={pastRecordData}
                    stopCloud={stopCloud}
                />

                <HUD
                    templateRatio={templateRatio}
                    listenerCount={listenerCount}
                    audioVolumeLevel={audioVolumeUI}
                    audioPlayer={audio}
                    pastRecordData={pastRecordData}
                />

                <LiveIndicator
                    templateRatio={templateRatio}
                    areWeLive={weAreLive}
                />

                <HeartSong
                    templateRatio={templateRatio}
                    currentSong={currentSong}
                />
            </>
            }

            <Player
                templateRatio={templateRatio}
                currentSong={currentSong}
                listenerCount={listenerCount}
                setLive={setWeAreLive}
                togglePlay={togglePlay}
                volumeChange={volumeChange}
                timeoutReached={timeoutReached}
                pastRecordData={pastRecordData}
            />

            <div ref={templateRef} >
                {/* For some reason if ref is on img then clientWidth gets 0 on useEffect */}
                <img id="boombox" src={radioTemplate} alt="Old style boombox player" />
            </div>
        </div>
    )
}

export default Radio
