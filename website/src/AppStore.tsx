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

const AppStore = ({ setSecret }: Props) => {
    const [pastRecordData, setPastRecordData] = useState<PastRecordData|null>(null);
    const [audio, toggleAudioPlayback, setAudioVolume, changeAudioSource] = useAudio('https://stream.dhradio.tk/playlist.ogg');

    const { setOverlay, toggleTimeout } = useContext(SettingsContext);

    /**
     * When the user stops the cloud recording and wants to go back to live.
     * Need to delete past record data, cancel the switch to full audio and toggle the timeout.
     */
    const stopCloudRecording = () => {
        console.log('Going back to live', pastRecordData, audio);
        setPastRecordData({
            name: 'Loading...',
            listeners: '00',
        });
        changeAudioSource(`https://stream.dhradio.tk/playlist.ogg?_${Math.random()}`, () => {
            console.log('pradeam statyt i null');
            setPastRecordData(null);
            toggleTimeout();
        });
    };

    /**
     * Starting recording from the cloud.
     * @param showName name of the show.
     * @param id name of the audio.
     * @param listeners listener count.
     */
    const startCloudRecording: StartCloudRecoding = async (showName, id, listeners) => {
        console.log('name', id, 'listeners', listeners);
        setPastRecordData({
            name: 'Loading...',
            listeners: '00',
        });
        changeAudioSource(getRemoteURL(showName, id), () => {
            setPastRecordData({
                name: id,
                listeners,
            });
        }, stopCloudRecording);
    };

    return (
        <>
            <Overlays startCloud={startCloudRecording} />
            <main>
                { window.innerWidth < 1025 && <Header /> }

                <Radio
                    pastRecordData={pastRecordData}
                    audio={audio}
                    toggleAudioPlayback={toggleAudioPlayback}
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
