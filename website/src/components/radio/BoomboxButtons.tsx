import { useContext, useState } from 'react';

import { SettingsContext } from 'context';
import { useDidMount } from 'hooks';
import pixels from 'pixels.json';
import { OverlayType, PastRecordData } from 'types';

import Button from './Button';

type Props = {
    templateRatio: number,
    togglePlay: (play: boolean) => void,
    volumeChange: (increaseVolume: boolean | number) => void,
    pastRecordData: PastRecordData | null,
    stopCloud: () => void,
}

const BoomboxButtons = ({ templateRatio, togglePlay, volumeChange, pastRecordData, stopCloud }: Props) => {
    const [playing, setPlaying] = useState(false);

    const { overlayType, setOverlay } = useContext(SettingsContext);

    const buttonHeight = templateRatio * pixels.boomboxButtons.height;
    const buttonWidth = templateRatio * pixels.boomboxButtons.width;
    const PODCAST_ENABLED = process.env.REACT_APP_PODCAST_ENABLED === 'true';

    useDidMount(() => {
        setPlaying(true); // Setting to button UI to play whenever playingPast changes
    }, [pastRecordData]);

    return (
        <div
            className="boombox-buttons"
            style={{
                marginTop: templateRatio * pixels.boomboxButtons.containerMarginTop - buttonHeight,
                pointerEvents: overlayType === OverlayType.TimeoutStart ? 'none' : 'auto',
            }}
        >
            <Button
                buttonType={`play ${overlayType === OverlayType.TimeoutStart ? '' : (playing ? 'active' : '')}`}
                buttonName="play_arrow"
                buttonHeight={buttonHeight}
                buttonWidth={buttonWidth}
                somethingLikeOnClick={() => {
                    togglePlay(true);
                    setPlaying(true);
                }}
            />
            <Button
                buttonType={`pause ${overlayType === OverlayType.TimeoutStart ? 'active' : (playing ? '' : 'active')}`}
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
            { PODCAST_ENABLED && (
                <Button
                    buttonType="podcast"
                    buttonName="podcasts"
                    buttonHeight={buttonHeight}
                    buttonWidth={buttonWidth}
                    somethingLikeOnClick={() => {
                        setOverlay(OverlayType.Podcast);
                    }}
                />
            )}
            <Button
                buttonType="info"
                buttonName="info"
                buttonHeight={buttonHeight}
                buttonWidth={buttonWidth}
                somethingLikeOnClick={() => {
                    setOverlay(OverlayType.Info);
                }}
            />
        </div>
    );
};

export default BoomboxButtons;
