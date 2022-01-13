import { useDelayBool } from 'hooks/DelayBool';

import HeartSong from './HeartSong';

type Props = {
    templateRatio: number,
    listenerCount: string,
    currentSong: string | null,
}

const PlayerHUD = ({ templateRatio, listenerCount, currentSong }: Props) => {
    const active = useDelayBool(200, [listenerCount]);

    return (
        <div id="player-hud">
            <div id="listeners">
                <span id="text">Current Listeners:&nbsp;</span>
                <span className={`listener-count ${active ? 'visible' : ''}`}>{listenerCount}</span>
            </div>
            <HeartSong
                templateRatio={templateRatio}
                currentSong={currentSong}
            />
        </div>
    );
};

export default PlayerHUD;
