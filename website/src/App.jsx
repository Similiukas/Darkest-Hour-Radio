import './styles/style.scss';
import { useState } from 'react';
import { useKonamiCode } from "./components/hooks/KonamiHook";
import { useAudio } from './components/hooks/AudioHook';
import cassette from "./images/cassette-min.png";
import Overlays from "./components/overlay_components/Overlays";
import Radio from './components/radio_components/Radio';
import Informacija from "./components/Informacija";
import RecrodingsDashboard from "./components/RecordingsDashboard";
import ChatContainer from "./components/chat/ChatContainer";
import SecretCanvas from "./components/SecretCanvas";

import song from "./Reformatai - Froze Off.mp3";

// TODO: Netlify looks good for api
// TODO: Minimize all the photos if not already wrote somewhere else. Also, look at other .todo
// TODO: Add liquidsoap backup playlist and see if that helps

let recordingLength = -1;
let startingCloudRecord = false;

let playbackTimeoutID = -1;

async function getRemoteURL(){
	return fetch(`http://127.0.0.1:5005/pipe?_${Math.random()}`, {
			mode: "cors",
			method: "GET"
		})
		.then(response =>{
			recordingLength = response.headers.get("recording-length");
			console.log("recording legnth:", recordingLength);
			if(!recordingLength) throw new Error("recording length is missing");
			return response.blob();
		})
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
	// TODO: purge all unneeded npm
	// TODO: If we start by playing the cloud record, how the timeout gonna be? I guess maybe then we don't need the timeout function? But still, when we press to go back to live, then we need to start timeout
	// TODO: Also, when the cloud record ends, what to do with UI?
	const [overlayType, setToggleOverlay] = useState("");
	const [secret, setSecret] = useState(false);
	const [pastRecordData, setPastRecordData] = useState(null);		// Sets this to an object, which has all the record metadata (listeners, length maybe, etc), then checks by checking if this is not null

	const [audio, toggleAudioPlay, setAudioVolume, playOtherURL, switchToNewAudio] = useAudio("https://stream.dhradio.tk/playlist.ogg");

	const toggleTimeout = () =>{
		if (playbackTimeoutID !== -1){
			console.log("cleared timeout", playbackTimeoutID);
			clearTimeout(playbackTimeoutID);
			playbackTimeoutID = -1;
		}
		else    playbackTimeoutID = setTimeout(setToggleOverlay, 5 * 10 * 1000, "timeout start");   // TODO: Make this longer
	}

	const startCloudRecording = async (id, name, listeners) =>{
		console.log("From app to cloud", id, audio.currentTime);
		setPastRecordData({
			name: "Loading...",
			listeners: "00"
		});
		let url = await getRemoteURL();
		if (url){
			console.log("name", name, "listeners", listeners);
			setPastRecordData({
				name: name,
				listeners: listeners
			});
			console.log(pastRecordData);
			startingCloudRecord = true;
			console.log("Final url", url);
			playOtherURL(url);
			audio.ontimeupdate = _ =>{	// For some reason playingPastRecord is still false here so cancelling this with playinPastRecord is kind of impossible?
				if(!startingCloudRecord){		// Cancelling the switch
					audio.ontimeupdate = null;
					return;
				}
				if (audio.currentTime > 7){	// > recording-length or just simply audio.duration - 20 or something, then don't need to set headers
					// Get longer recording url first and register a view on db
					audio.ontimeupdate = null;
					switchToNewAudio(song);
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
					<div id="cassette-container">
						<img id="cassette" src={cassette} alt="cassette" onClick={(e) => { if (e.detail === 3) setSecret(true) }}/>
					</div>

					<Radio
						overlayType={overlayType}
						toggleOverlay={setToggleOverlay}
						toggleTimeout={toggleTimeout}
						pastRecordData={pastRecordData}
						audio={audio}
						audioToggle={toggleAudioPlay}
						audioVolume={setAudioVolume}
						stopCloud={stopCloudRecording}/>

					<Informacija />

					{ window.innerWidth < 1025 &&
						<RecrodingsDashboard
							toggleOverlay={setToggleOverlay}
							pastRecordData={pastRecordData}
							stopCloud={stopCloudRecording}/>
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
