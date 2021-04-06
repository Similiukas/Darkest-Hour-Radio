import cassette from "../../images/cassette-min.png";

const PodcastShowRecording = ({ id, text, callCloud }) => {
    return (
        <div className="podcast-recording" onClick={() => callCloud(id, text, 12)}>
            <div className="recording-photo-container">
                <img id="recording-photo" src={cassette} alt="some alt" />
            </div>
            <div className="recording-info">
                <div id="recording-name">{text}</div>
                <div id="recording-listeners">Listeners: 123</div>
                <div id="recording-length">Length: 1:47:12</div>
                <div id="recording-date">Date: 2021/04/12</div>
            </div>
        </div>
    )
}

export default PodcastShowRecording
