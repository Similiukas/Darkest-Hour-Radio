import { useState } from 'react';

import { useDidMount } from 'hooks/EffectExceptFirst';
import pixels from 'pixels.json';

// TODO: prie hooks pridet tiesiog index.d.ts kur butu visi export
import Button from './Button';

type Props = {
    templateRatio: number,
    togglePlay: (play: boolean) => void,
    volumeChange: (increaseVolume: boolean | number) => void,
    toggleOverlay: (overlayType: string) => void,
    timeoutReached: boolean,
    pastRecordData: any,
    stopCloud: () => void,
}

const BoomboxButtons = ({ templateRatio, togglePlay, volumeChange, toggleOverlay, timeoutReached, pastRecordData, stopCloud }: Props) => {
    const [playing, setPlaying] = useState(false);

    const buttonHeight = templateRatio * pixels.boomboxButtons.height;
    const buttonWidth = templateRatio * pixels.boomboxButtons.width;

    useDidMount(() => {
        setPlaying(true); // Setting to button UI to play whenever playingPast changes
    }, [pastRecordData]);

    return (
        <div
            className="boombox-buttons"
            style={{
                marginTop: templateRatio * pixels.boomboxButtons.containerMarginTop - buttonHeight,
                pointerEvents: timeoutReached ? 'none' : 'auto',
            }}
        >
            <Button
                buttonType={`play ${timeoutReached ? '' : (playing ? 'active' : '')}`}
                buttonName="play_arrow"
                buttonHeight={buttonHeight}
                buttonWidth={buttonWidth}
                somethingLikeOnClick={() => {
                    togglePlay(true);
                    setPlaying(true);
                }}
            />
            <Button
                buttonType={`pause ${timeoutReached ? 'active' : (playing ? '' : 'active')}`}
                buttonName="pause"
                buttonHeight={buttonHeight}
                buttonWidth={buttonWidth}
                somethingLikeOnClick={() => {
                    togglePlay(false);
                    setPlaying(false);
                }}
            />
            { pastRecordData && (
                <Button
                    buttonType="stop"
                    buttonName="stop"
                    buttonHeight={buttonHeight}
                    buttonWidth={buttonWidth}
                    somethingLikeOnClick={stopCloud}
                />
            )}
            <Button
            // TODO: perziet ar reik skirtingu tu type ir name
                buttonType="volume_down"
                buttonName="volume_down"
                buttonHeight={buttonHeight}
                buttonWidth={buttonWidth}
                somethingLikeOnClick={() => {
                    volumeChange(false);
                }}
            />
            <Button
                buttonType="volume_up"
                buttonName="volume_up"
                buttonHeight={buttonHeight}
                buttonWidth={buttonWidth}
                somethingLikeOnClick={() => {
                    volumeChange(true);
                }}
            />
            {/* <Button buttonType="podcast" buttonName="podcasts" buttonHeight={buttonHeight} buttonWidth={buttonWidth}
                    somethingLikeOnClick={() => {
                        toggleOverlay("podcast");
                    }}/> */}
            <Button
                buttonType="info"
                buttonName="info"
                buttonHeight={buttonHeight}
                buttonWidth={buttonWidth}
                somethingLikeOnClick={() => {
                    toggleOverlay('info');
                }}
            />
        </div>
    );
};

export default BoomboxButtons;
