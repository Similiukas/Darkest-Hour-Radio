import './styles/style.scss';
import { useState } from 'react';
import { useKonamiCode } from "./components/hooks/KonamiHook";
import { useAudio } from './components/hooks/AudioHook';
import Overlays from "./components/overlay_components/Overlays";
import Header from "./components/Header";
import Radio from './components/radio_components/Radio';
import Informacija from "./components/Informacija";
import RecrodingsDashboard from "./components/RecordingsDashboard";
import ChatContainer from "./components/chat/ChatContainer";
import SecretCanvas from "./components/SecretCanvas";


// TODO: Minimize all the photos if not already wrote somewhere else. Also, look at other .todo
// TODO: Add liquidsoap backup playlist and see if that helps
// TODO: Sumazint tuos visus console log
let startingCloudRecord = false;
let playbackTimeoutID = -1;

async function getRemoteURL(showName, id, shortURL=true){
	return fetch(`https://nameless-citadel-71535.herokuapp.com/${shortURL ? "recordShortURL" : "recordFullURL"}/${showName}/${id}`, {
			mode: "cors",
			method: "GET"
		})
		.then(response =>response.blob())
		.then((blob) => {
			let url = URL.createObjectURL(blob);
			return url;
		})
		.catch((err) =>{
			console.error("woops", err);
			return null;
		});
}


function App() {
	// TODO: If we start by playing the cloud record, how the timeout gonna be? I guess maybe then we don't need the timeout function? But still, when we press to go back to live, then we need to start timeout
	// TODO: Also, when the cloud record ends, what to do with UI?
	const [overlayType, setToggleOverlay] = useState("");
	const [secret, setSecret] = useState(false);
	const [pastRecordData, setPastRecordData] = useState(null);

	const [audio, toggleAudioPlay, setAudioVolume, playOtherURL, switchToNewAudio] = useAudio("https://stream.dhradio.tk/playlist.ogg");

	const toggleTimeout = () =>{
		if (playbackTimeoutID !== -1){
			clearTimeout(playbackTimeoutID);
			playbackTimeoutID = -1;
		}
		else    playbackTimeoutID = setTimeout(setToggleOverlay, 2.6 * 60 * 60 * 1000, "timeout start");
	}

	const startCloudRecording = async (showName, id, name, listeners) =>{
		console.log("From app to cloud", id);
		setPastRecordData({
			name: "Loading...",
			listeners: "00"
		});
		let url = await getRemoteURL(showName, id);
		if (url){
			console.log("name", name, "listeners", listeners);
			setPastRecordData({
				name: name,
				listeners: listeners
			});
			startingCloudRecord = true;
			playOtherURL(url);
			audio.ontimeupdate = async _ =>{
				if(!startingCloudRecord){		// Cancelling the switch
					audio.ontimeupdate = null;
					return;
				}
				if (audio.currentTime > audio.duration - 20){
					let longerURL = await getRemoteURL(showName, id, true);
					audio.ontimeupdate = null;
					if (longerURL){
						switchToNewAudio(longerURL);
					}
					else console.error("There's been an error getting longer url");
				};
			}
		}
		else console.error("There's been an error");
	}

	const stopCloudRecording = () =>{
		console.log("Going back to live", pastRecordData);
		setPastRecordData(null);
		startingCloudRecord = false;
		playOtherURL(`https://stream.dhradio.tk/playlist.ogg?_${Math.random()}`);
		toggleTimeout();
	}

	useKonamiCode(() => {
		console.log("Let the party begin");
		setSecret(true);
	})

	return (
		<>
			{ secret && <SecretCanvas /> }

			{ !secret &&
			<>
				<Overlays overlayType={overlayType} setToggleOverlay={setToggleOverlay} startCloud={startCloudRecording}/>
				<main>
					{ window.innerWidth < 1025 &&
						<Header />
					}

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

					{ window.innerWidth < 1025 &&
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
					}

					<ChatContainer />

					<footer><a href="https://github.com/Similiukas" target="_blank" rel="noopener noreferrer">©Similiukas 2021</a></footer>
				</main>
			</>
			}
		</>
	);
}

export default App;
