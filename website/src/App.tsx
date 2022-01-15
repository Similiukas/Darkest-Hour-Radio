import { useState } from 'react';

import ChatContainer from 'components/chat/ChatContainer';
import Header from 'components/Header';
import Informacija from 'components/Informacija';
import Overlays from 'components/overlay_components/Overlays';
import Radio from 'components/radio_components/Radio';
// import RecrodingsDashboard from 'components/RecordingsDashboard';
import SecretCanvas from 'components/SecretCanvas';
import { useAudio, useKonamiCode } from 'hooks';
import 'styles/style.scss';
import { OverlayType, PastRecordData } from 'types';

// TODO: Minimize all the photos if not already wrote somewhere else. Also, look at other .todo
// TODO: Add liquidsoap backup playlist and see if that helps
// TODO: Sumazint tuos visus console log
let startingCloudRecord = false;
// TODO: paziet sita, nes gal but lus: https://stackoverflow.com/a/50428377
// eslint-disable-next-line no-undef
let playbackTimeoutID: NodeJS.Timeout|null = null;

async function getRemoteURL(showName: string, id: string, shortURL = true) {
    return fetch(`https://nameless-citadel-71535.herokuapp.com/${shortURL ? 'recordShortURL' : 'recordFullURL'}/${showName}/${id}`, {
        mode: 'cors',
        method: 'GET',
    })
    .then((response) => response.blob())
    .then((blob) => {
        const url = URL.createObjectURL(blob);
        return url;
    })
    .catch((err) => {
        console.error('woops', err);
        return null;
    });
}

const App = () => {
    // TODO: If we start by playing the cloud record, how the timeout gonna be? I guess maybe then we don't need the timeout function? But still, when we press to go back to live, then we need to start timeout
    // TODO: Also, when the cloud record ends, what to do with UI?
    const [overlayType, setToggleOverlay] = useState<OverlayType>(OverlayType.Empty);
    const [secret, setSecret] = useState(false);
    const [pastRecordData, setPastRecordData] = useState<PastRecordData|null>(null);

    const [audio, toggleAudioPlay, setAudioVolume, playOtherURL, switchToNewAudio] = useAudio('https://stream.dhradio.tk/playlist.ogg');

    const toggleTimeout = () => {
        if (playbackTimeoutID !== null) {
            clearTimeout(playbackTimeoutID);
            playbackTimeoutID = null;
        } else playbackTimeoutID = setTimeout(setToggleOverlay, 2.6 * 60 * 60 * 1000, OverlayType.TimeoutStart);
    };

    const startCloudRecording = async (showName: string, id: string, name: string, listeners: string) => {
        console.log('From app to cloud', id);
        setPastRecordData({
            name: 'Loading...',
            listeners: '00',
        });
        const url = await getRemoteURL(showName, id);
        if (url) {
            console.log('name', name, 'listeners', listeners);
            setPastRecordData({
                name,
                listeners,
            });
            startingCloudRecord = true;
            playOtherURL(url);
            audio.ontimeupdate = async () => {
                if (!startingCloudRecord) { // Cancelling the switch
                    audio.ontimeupdate = null;
                    return;
                }
                if (audio.currentTime > audio.duration - 20) {
                    const longerURL = await getRemoteURL(showName, id, true);
                    audio.ontimeupdate = null;
                    if (longerURL) {
                        switchToNewAudio(longerURL);
                    } else console.error("There's been an error getting longer url");
                }
            };
        } else console.error("There's been an error");
    };

    const stopCloudRecording = () => {
        console.log('Going back to live', pastRecordData);
        setPastRecordData(null);
        startingCloudRecord = false;
        playOtherURL(`https://stream.dhradio.tk/playlist.ogg?_${Math.random()}`);
        toggleTimeout();
    };

    useKonamiCode(() => {
        console.log('Let the party begin');
        setSecret(true);
    });

    return (
        <>
            { secret && <SecretCanvas /> }

            { !secret && (
                <>
                    <Overlays overlayType={overlayType} setToggleOverlay={setToggleOverlay} startCloud={startCloudRecording} />
                    <main>
                        { window.innerWidth < 1025 &&
                        <Header />}

                        <Radio
                            overlayType={overlayType}
                            toggleOverlay={setToggleOverlay}
                            toggleTimeout={toggleTimeout}
                            pastRecordData={pastRecordData}
                            audio={audio}
                            audioToggle={toggleAudioPlay}
                            audioVolume={setAudioVolume}
                            stopCloud={stopCloudRecording}
                        />

                        { window.innerWidth < 1025 && (
                            <>
                                <Informacija
                                    secret={setSecret}
                                />

                                {/* <RecrodingsDashboard
                                    toggleOverlay={setToggleOverlay}
                                    pastRecordData={pastRecordData}
                                    stopCloud={stopCloudRecording}
                                /> */}
                            </>
                        )}

                        <ChatContainer />

                        <footer><a href="https://github.com/Similiukas" target="_blank" rel="noopener noreferrer">©Similiukas 2021</a></footer>
                    </main>
                </>
            )}
        </>
    );
};

export default App;
