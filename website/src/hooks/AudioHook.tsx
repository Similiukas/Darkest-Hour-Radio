import { useState, useEffect } from 'react';

import useDidMount from './EffectExceptFirst';

type OwnProps = [
    audio: HTMLAudioElement,
    toggleAudio: (toggleLive: boolean) => void,
    changeVolume: (increase: boolean) => void,
    changeAudioSource: (url: string, startedPlayingCallback: () => void, onAudioEndedCallback?: (() => void)) => void,
]

export default function useAudio(url: string, volume = 0.4): OwnProps {
    const [audio] = useState(new Audio());
    const [playing, setPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState(url);

    const changeVolume = (increase: boolean) => {
        if (increase) audio.volume = (audio.volume >= 0.85) ? 1 : audio.volume + 0.1;
        else audio.volume = (audio.volume <= 0.15) ? 0 : audio.volume - 0.1;
    };

    const toggleAudioPlayback = (toggleLive: boolean) => {
        if (!playing && toggleLive) audio.src = `${url}?_=${Math.random()}`;
        // Gradually reducing volume before pausing
        if (playing) {
            const duration = 400; let i = 0; // 0.4 second but the actual setInterval time is about +300ms due to settings state and all
            const initialVolume = audio.volume;
            const P0 = initialVolume * 0.5; const P1 = 0.02; const P2 = 0.16; const P3 = 0;
            const intervalID = setInterval(() => {
                if (audio.volume > 0) {
                    const t = (100 * i++) / duration;
                    // Cubic bezier curve: https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curves
                    // With P0 as initial lowered volume and P3 the final. P3 can be negative to get a bigger dip in volume
                    // eslint-disable-next-line space-infix-ops
                    const newValue = (1-t)**3*P0 + 3*(1-t)**2*t*P1 + 3*(1-t)*t**2*P2 + t**3*P3;
                    audio.volume = newValue > 0 ? newValue : 0;
                } else {
                    setPlaying(false);
                    // When the audio is finally paused (not necessarily on next interval) we reset the audio volume and clear interval
                    if (audio.paused) {
                        clearInterval(intervalID);
                        audio.volume = initialVolume;
                        if (toggleLive) audio.src = ''; // Deleting mount to Icecast for server to update its listener count
                    }
                }
            }, 100);
        } else setPlaying(true);
    };

    const changeAudioSource = (url: string, startedPlayingCallback: () => void, onAudioEndedCallback?: () => void) => {
        setPlaying(false); // Stopping what played before (if it played)
        // Not setting the src directly, since because onended can call this and the audio element will be outdated
        setAudioUrl(url);
        const startPlaying = () => {
            audio.removeEventListener('canplaythrough', startPlaying);
            setPlaying(true);
            startedPlayingCallback();
        };
        audio.addEventListener('canplaythrough', startPlaying);
        // TODO: need to test this
        if (onAudioEndedCallback) {
            const audioEnded = () => {
                audio.removeEventListener('ended', audioEnded);
                onAudioEndedCallback();
            };
            audio.addEventListener('ended', audioEnded);
        }
    };

    // Setting the url except on load (so listener count doesn't increase before pressing play)
    useDidMount(() => {
        audio.src = audioUrl;
        audio.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audioUrl]);

    useEffect(() => {
        if (playing) {
            audio.play();
        } else {
            audio.pause();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playing]);

    // Initial values
    useEffect(() => {
        // audio.preload = "none";
        audio.preload = 'auto';
        audio.crossOrigin = 'none';
        audio.volume = volume;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [audio, toggleAudioPlayback, changeVolume, changeAudioSource];
}
