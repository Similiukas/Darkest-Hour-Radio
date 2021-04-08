import { useDelayBool } from "../hooks/DelayBool";
import HeartSong from "./HeartSong";

const PlayerHUD = ({ templateRatio, listenerCount, currentSong }) => {
    const active = useDelayBool(listenerCount, 200);

    return (
        <div id="player-hud">
            <div id="listeners">
                <span id="text">Current Listeners:&nbsp;</span>
                <span className={`listener-count ${active ? "visible" : ""}`}>{listenerCount}</span>
            </div>
            <HeartSong
                templateRatio={templateRatio}
                currentSong={currentSong}
            />
        </div>
    )
}

export default PlayerHUD
