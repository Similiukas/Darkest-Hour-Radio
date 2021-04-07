import cassette from "../../images/cassette-min.png";

function getDate(date){
    // For some reason date.toLocaleString() returns [object Object]
    return new Date(date["_seconds"] * 1000).toLocaleDateString();
}

function getLegnth(length){
    const hours = Math.floor((length % (60 * 60 * 24)) / (60 * 60)).toString().padStart(2, "0");
    const minutes = Math.floor((length % (60 * 60)) / 60).toString().padStart(2, "0");
    const seconds = Math.floor(length % 60).toString().padStart(2, "0");
    return hours + ":" + minutes + ":" + seconds;
}

const PodcastShowRecording = ({ id, show, text, listeners, length, date, callCloud }) => {
    return (
        <div className="podcast-recording" onClick={() => callCloud(show, id, text, 12)}>
            <div className="recording-photo-container">
                <img id="recording-photo" src={cassette} alt="some alt" />
            </div>
            <div className="recording-info">
                <div id="recording-name">{text}</div>
                <div id="recording-listeners">Listeners: {listeners}</div>
                <div id="recording-length">Length: {getLegnth(length)}</div>
                <div id="recording-date">Date: {getDate(date)}</div>
            </div>
        </div>
    )
}

export default PodcastShowRecording
