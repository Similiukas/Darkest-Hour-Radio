import { useState, useEffect } from 'react';

type OwnProps = [
    audio: HTMLAudioElement,
    toggleAudio: (toggleLive: boolean) => void,
    changeVolume: (increase: boolean) => void,
    changeAndPlayURL: (audioUrl: string) => Promise<void>,
    switchToNewAudio: (audioUrl: string) => void,
]

export default function useAudio(url: string, volume = 0.4): OwnProps {
    const [audio, setAudio] = useState(new Audio());
    const [playing, setPlaying] = useState(false);

    const changeVolume = (increase: boolean) => {
        if (increase) audio.volume = (audio.volume >= 0.85) ? 1 : audio.volume + 0.1;
        else audio.volume = (audio.volume <= 0.15) ? 0 : audio.volume - 0.1;
    };

    const toggleAudio = (toggleLive: boolean) => {
        if (!playing && toggleLive) audio.src = `${url}?_=${Math.random()}`;
        setPlaying(!playing);
    };

    const changeAndPlayURL = async (audioUrl: string) => {
        // toggleAudio(true);      // Can be false, can be null
        setPlaying(false); // Stopping what played before (if it played)
        audio.src = audioUrl;
        await audio.load(); // I think I still need await
        setPlaying(true);
    };

    const switchToNewAudio = (audioUrl: string) => {
        const newAudio = new Audio(audioUrl);
        newAudio.crossOrigin = 'none';
        newAudio.load();
        // This way almost can't hear the transition
        newAudio.oncanplaythrough = () => {
            // audio.ontimeupdate = null;   Maybe don't even need this?
            newAudio.oncanplaythrough = null;
            newAudio.volume = audio.volume;

            console.log('Swapping right now!');
            newAudio.currentTime = audio.currentTime;

            setPlaying(false);
            setAudio(newAudio);
            setPlaying(true);
        };

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
    };

    useEffect(() => {
        if (playing) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [playing, audio]);

    // Initial values
    useEffect(() => {
        // audio.preload = "none";
        audio.preload = 'auto';
        audio.crossOrigin = 'none';
        audio.volume = volume;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [audio, toggleAudio, changeVolume, changeAndPlayURL, switchToNewAudio];
}
