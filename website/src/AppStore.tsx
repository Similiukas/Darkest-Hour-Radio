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

let preparingToStartCloud = false;

const AppStore = ({ setSecret }: Props) => {
    const [pastRecordData, setPastRecordData] = useState<PastRecordData|null>(null);
    const [audio, toggleAudioPlay, setAudioVolume, playOtherURL, switchToNewAudio] = useAudio('https://stream.dhradio.tk/playlist.ogg');

    const { setOverlay, toggleTimeout } = useContext(SettingsContext);
    // const { toggleTimeout } = useContext(SettingsContext);

    /**
     * When the user stops the cloud recording and wants to go back to live.
     * Need to delete past record data, cancel the switch to full audio and toggle the timeout.
     */
    const stopCloudRecording = () => {
        console.log('Going back to live', pastRecordData, audio);
        setPastRecordData(null);
        preparingToStartCloud = false; // To cancel the switch
        playOtherURL(`https://stream.dhradio.tk/playlist.ogg?_${Math.random()}`);
        toggleTimeout();
    };

    // FIXME: best way is to just pipe audio in chunks. Which is done by adding range header?
    // https://stackoverflow.com/a/42591021/9819103
    // another example: https://github.com/AnthumChris/fetch-stream-audio
    // or here with a video: https://www.linode.com/docs/guides/build-react-video-streaming-app/#stream-a-video
    // cia irgi visai neblogai atrodo gal: https://blog.bywachira.com/post/stream-mp3-link-to-html-audio-tag

    /**
     * Starting recording from the cloud. First, it starts the short clip and after it's close to the end,
     * Switching to the full audio.
     * @param showName name of the show.
     * @param id name of the audio.
     * @param listeners listener count.
     */
    const startCloudRecording: StartCloudRecoding = async (showName, id, listeners) => {
        setPastRecordData({
            name: 'Loading...',
            listeners: '00',
        });
        const url = await getRemoteURL(showName, id);
        if (url) {
            console.log('name', id, 'listeners', listeners);
            setPastRecordData({
                name: id,
                listeners,
            });
            preparingToStartCloud = true;
            let startingTheSwitch = false; // So the switch operation is called once
            playOtherURL(url);
            audio.ontimeupdate = async () => {
                if (!preparingToStartCloud) { // Cancelling the switch
                    audio.ontimeupdate = null;
                    startingTheSwitch = false;
                    return;
                }
                if (!startingTheSwitch && audio.currentTime > audio.duration - 100) { // 20
                    startingTheSwitch = true;
                    const longerURL = await getRemoteURL(showName, id, false);
                    audio.ontimeupdate = null;
                    startingTheSwitch = false;
                    if (longerURL) {
                        switchToNewAudio(longerURL, stopCloudRecording);
                    } else console.error("There's been an error getting longer url");
                }
            };
        } else console.error("There's been an error");
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
