import { useState, useEffect } from 'react';

export function useAudio(url, volume=0.4){
    const [audio, setAudio] = useState(new Audio());
    const [playing, setPlaying] = useState(false);

    const changeVolume = increase => {
        if (increase)   audio.volume = (audio.volume >= 0.85) ? 1 : audio.volume + 0.1;
        else            audio.volume = (audio.volume <= 0.15) ? 0 : audio.volume - 0.1;
    }

    const toggleAudio = (toggleLive) => {
        if (!playing && toggleLive) audio.src = `${url}?_=${Math.random()}`;
        setPlaying(!playing);
    }

    const changeAndPlayURL = async (url) => {
        // toggleAudio(true);      // Can be false, can be null
        setPlaying(false);          // Stopping what played before (if it played)
        audio.src = url;
        await audio.load();     // I think I still need await
        setPlaying(true);
    }

    const switchToNewAudio = (url) => {
        const newAudio = new Audio(url);
        newAudio.crossOrigin = "none";
        newAudio.load();
        // This way almost can't hear the transition
        newAudio.oncanplaythrough = () =>{
            // audio.ontimeupdate = null;   Maybe don't even need this?
            newAudio.oncanplaythrough = null;
            newAudio.volume = audio.volume;
            
            console.log("Swapping right now!");
            newAudio.currentTime = audio.currentTime;
            
            setPlaying(false);
            setAudio(newAudio);
            setPlaying(true);
        }
        
        // const swapAt = audio.currentTime + 3;
        // audio.ontimeupdate = () =>{
        //     console.log("update");
        //     if (audio.currentTime >= swapAt){
        //         // audio.ontimeupdate = null;   Maybe don't even need this?
        //         newAudio.volume = audio.volume;
                
        //         console.log("Swapping right now!");
        //         newAudio.currentTime = audio.currentTime;

        //         setPlaying(false);
        //         setAudio(newAudio);
        //         setPlaying(true);
        //     }
        // }
    }
  
    useEffect(() => {
        playing ? audio.play() : audio.pause();
        // eslint-disable-next-line
    }, [playing]);

    // Initial values
    useEffect(() => {
        // audio.preload = "none";
        console.log("Initial audio values");
        audio.preload = "auto";
        audio.crossOrigin = "none";
        audio.volume = volume;
        // eslint-disable-next-line
    }, []);

    return [audio, toggleAudio, changeVolume, changeAndPlayURL, switchToNewAudio];
};