import { Timestamp } from 'firebaseConfig';
import cassette from 'images/cassette-min.png';

type Props = {
    showName: string,
    name: string,
    listeners: string,
    length: number,
    date: Timestamp,
    callCloud: (showName: string, name: string, listeners: string) => void
}

function getDate(date: Timestamp) {
    // For some reason date.toLocaleString() returns [object Object] and it's not even a Timestamp object even tho it should be?
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    return new Date(date._seconds * 1000).toLocaleDateString();
}

function getLegnth(length: number) {
    const hours = Math.floor((length % (60 * 60 * 24)) / (60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((length % (60 * 60)) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(length % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

const PodcastShowRecording = ({ showName, name, listeners, length, date, callCloud }: Props) => (
    <div className="podcast-recording" role="button" tabIndex={0} onClick={() => callCloud(showName, name, listeners)}>
        <div className="recording-photo-container">
            <img id="recording-photo" src={cassette} alt="some alt" />
        </div>
        <div className="recording-info">
            <div id="recording-name">{name}</div>
            <div id="recording-listeners">Listeners: {listeners}</div>
            <div id="recording-length">Length: {getLegnth(length)}</div>
            <div id="recording-date">Date: {getDate(date)}</div>
        </div>
    </div>
);

export default PodcastShowRecording;
