import { useState, useRef, useEffect, useContext, useCallback } from 'react';

import { SettingsContext } from 'context';
import radioTemplate from 'images/desktop-template-3-min.webp';
import pixels from 'pixels.json';
import { OverlayType, PastRecordData } from 'types';

import BoomboxButtons from './BoomboxButtons';
import Cassette from './Cassette';
import HeartSong from './HeartSong';
import HUD from './HUD';
import LiveIndicator from './LiveIndicator';
import Player from './Player';

type Props = {
    audio: HTMLAudioElement,
    toggleAudioPlayback: (toggleLive: boolean) => void,
    audioVolume: (increase: boolean) => void,
    pastRecordData: PastRecordData | null,
    stopCloud: () => void,
}

let offline = true;

const Radio = ({ audio, toggleAudioPlayback, audioVolume, pastRecordData, stopCloud }: Props) => {
    const [listenerCount, setListenerCount] = useState('00');
    const [currentSong, setCurrentSong] = useState<string | null>(null);
    const [templateRatio, setTemplateRatio] = useState(0);
    const [audioVolumeUI, setAudioVolumeUI] = useState(0.4); // For setting the height of HUD sound bars
    const [weAreLive, setWeAreLive] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const templateRef = useRef<HTMLDivElement>(null); // Ref for template image div

    const { overlayType, setOverlay, toggleTimeout } = useContext(SettingsContext);

    const togglePlay = useCallback((startPlaying: boolean) => {
        console.log('toggle play?', startPlaying, offline, audio);

        if (pastRecordData && audio.paused === startPlaying) {
            toggleAudioPlayback(false); // Toggling audio of recording even if we are offline
            setIsAudioPlaying(startPlaying);
        } else if (!offline && audio.paused === startPlaying) { // If not offline button only starts or pauses (just for PC buttons)
            toggleAudioPlayback(true);
            toggleTimeout();
            setIsAudioPlaying(startPlaying);
        } else console.error('We are probably offline?', offline, audio, startPlaying);
    }, [audio, toggleAudioPlayback, pastRecordData, toggleTimeout]);

    const volumeChange = (increase: boolean | number) => {
        if (typeof increase === 'boolean') {
            audioVolume(increase);
            setAudioVolumeUI(audio.volume);
        // eslint-disable-next-line no-param-reassign
        } else audio.volume = increase;
    };

    // Hook for calling radio server for info
    useEffect(() => {
        const getInfo = async () => {
            if (pastRecordData) return;
            try {
                const info = await fetch(`https://stream.dhradio.tk/status-json.xsl?_=${Math.random()}`);
                const json = await info.json();
                const source = Array.isArray(json.icestats.source) ? json.icestats.source[0] : json.icestats.source;
                setListenerCount(source.listeners.toString().padStart(2, '0'));
                if (currentSong !== source.title) { // If changed back to live, immediately changing song info to current live
                    offline = false;
                    if (source.title === 'radio-ad-1') {
                        setCurrentSong('ad');
                    } else if (source.title !== undefined && source.title !== 'Unknown' && source.title.trim() !== '$live$') {
                        setCurrentSong(source.title);
                    }
                }
            } catch (err) {
                console.error('Something is WRONG', err);
                setListenerCount('00');
                setCurrentSong('');
                offline = true; // Change to backup image and reset artist text
            }
        };
        if (pastRecordData) {
            setIsAudioPlaying(true);
            setListenerCount(pastRecordData.listeners);
            setCurrentSong(null); // This way, Player.jsx doesn't do anything with current song and when changing back to live, immediately updating to current live song
        }
        getInfo(); // Gets called on load
        const timer = setInterval(getInfo, 12000);
        return () => { clearInterval(timer); };
    }, [currentSong, pastRecordData]);

    // Timeout useEffect hook for pausing/playing the audio when timeout is reached/ended
    // Also, notifies boombox buttons to change
    useEffect(() => {
        if (overlayType === OverlayType.TimeoutStart) {
            togglePlay(false);
        } else if (overlayType === OverlayType.TimeoutEnd) {
            togglePlay(true);
            setOverlay(OverlayType.Empty);
        }
    // If togglePlay is added to dep-array, then it will get called 3 times causing an error on third one
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [overlayType, setOverlay]);

    // Hook placing UI objects based on template size
    useEffect(() => {
        console.info('placing objects', templateRef.current);
        if (!templateRef.current) return undefined;
        setTemplateRatio(templateRef.current.clientWidth / pixels.templateWidth); // Calling initially
        function resizing() {
            if (!templateRef.current) return;
            setTemplateRatio(templateRef.current.clientWidth / pixels.templateWidth);
        }
        window.addEventListener('resize', resizing); // Calling after window is resized
        // Cleaning up to prevent memory leak (https://www.pluralsight.com/guides/re-render-react-component-on-window-resize)
        return () => window.removeEventListener('resize', resizing);
    }, [templateRef]);

    return (
        <div id="radio">
            { window.innerWidth > 1025 && (
                <>
                    <BoomboxButtons
                        templateRatio={templateRatio}
                        togglePlay={togglePlay}
                        volumeChange={volumeChange}
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

                    { currentSong && (
                        <HeartSong
                            templateRatio={templateRatio}
                            currentSong={currentSong}
                        />
                    )}
                    <Cassette
                        templateRatio={templateRatio}
                        playing={isAudioPlaying}
                    />
                </>
            )}

            <Player
                templateRatio={templateRatio}
                currentSong={currentSong}
                listenerCount={listenerCount}
                setLive={setWeAreLive}
                togglePlay={togglePlay}
                volumeChange={volumeChange}
                pastRecordData={pastRecordData}
            />

            <div ref={templateRef}>
                {/* For some reason if ref is on img then clientWidth gets 0 on useEffect */}
                <img id="boombox" src={radioTemplate} alt="Old style boombox player" />
            </div>
        </div>
    );
};

export default Radio;
