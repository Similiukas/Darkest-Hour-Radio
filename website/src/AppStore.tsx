import { useContext, useState } from 'react';

import Header from 'components/Header';
import Informacija from 'components/Informacija';
import Overlays from 'components/overlay/Overlays';
import Radio from 'components/radio/Radio';
import RecrodingsDashboard from 'components/RecordingsDashboard';
import { SettingsContext } from 'context';
import { useAudio } from 'hooks';
import { PastRecordData, StartCloudRecoding } from 'types';
import { getRemoteURL } from 'utils';

type Props = {
    setSecret: (enable: boolean) => void;
}

let startingCloudRecord = false;

const AppStore = ({ setSecret }: Props) => {
    const [pastRecordData, setPastRecordData] = useState<PastRecordData|null>(null);
    const [audio, toggleAudioPlay, setAudioVolume, playOtherURL, switchToNewAudio] = useAudio('https://stream.dhradio.tk/playlist.ogg');

    const { setOverlay, toggleTimeout } = useContext(SettingsContext);

    const startCloudRecording: StartCloudRecoding = async (showName, id, name, listeners) => {
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

    return (
        <>
            <Overlays startCloud={startCloudRecording} />
            <main>
                { window.innerWidth < 1025 && <Header /> }

                <Radio
                    pastRecordData={pastRecordData}
                    audio={audio}
                    audioToggle={toggleAudioPlay}
                    audioVolume={setAudioVolume}
                    stopCloud={stopCloudRecording}
                />

                { window.innerWidth < 1025 && (
                    <>
                        <Informacija secret={setSecret} />

                        <RecrodingsDashboard
                            toggleOverlay={setOverlay}
                            pastRecordData={pastRecordData}
                            stopCloud={stopCloudRecording}
                        />
                    </>
                )}

                <footer><a href="https://github.com/Similiukas" target="_blank" rel="noopener noreferrer">©Similiukas 2021</a></footer>
            </main>
        </>
    );
};

export default AppStore;
