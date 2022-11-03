import { useContext, useEffect } from 'react';

import { SettingsContext } from 'context';
import { useDelayUnmount } from 'hooks';
import { OverlayType, ScheduleInfo, StartCloudRecoding } from 'types';

import Info from './Info';
import PodcastContainer from './PodcastContainer';
import Timeout from './Timeout';

type Props = {
    startCloud: StartCloudRecoding,
}

// Idk, whether it would be better to do this. Tipo calling through parent (App.jsx) closing and opening overlays
// https://medium.com/@nugen/react-hooks-calling-child-component-function-from-parent-component-4ea249d00740
// https://stackoverflow.com/a/37950970/9819103
const Overlays = ({ startCloud }: Props) => {
    const { overlayType, setOverlay, setScheduleInfo } = useContext(SettingsContext);
    const shouldRenderInfo = useDelayUnmount(overlayType === OverlayType.Info, 400);
    const shouldRenderPodcast = useDelayUnmount(overlayType === OverlayType.Podcast, 400);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_REMOTE_API_URL}/schedule`)
        .then((res) => res.json())
        .then((result) => setScheduleInfo(result.sort((a: ScheduleInfo, b: ScheduleInfo) => b.priority - a.priority)));
    }, [setScheduleInfo]);

    return (
        <>
            { shouldRenderInfo && (
                <Info
                    mounting={overlayType === OverlayType.Info}
                    onClick={() => {
                        setOverlay(OverlayType.Empty);
                    }}
                />
            )}

            { shouldRenderPodcast && (
                <PodcastContainer
                    mounting={overlayType === OverlayType.Podcast}
                    startCloud={startCloud}
                    close={() => {
                        setOverlay(OverlayType.Empty);
                    }}
                />
            )}

            { overlayType === OverlayType.TimeoutStart && (
                <Timeout
                    onClick={() => {
                        setOverlay(OverlayType.TimeoutEnd);
                    }}
                />
            )}
        </>
    );
};

export default Overlays;
