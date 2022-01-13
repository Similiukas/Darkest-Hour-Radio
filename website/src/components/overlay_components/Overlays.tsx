import { useState, useEffect } from 'react';

import { useDelayUnmount } from 'hooks/DelayUnmountHook';

import Info from './Info';
import Podcast from './Podcast';
import Timeout from './Timeout';

type Props = {
    overlayType: string,
    setToggleOverlay: (overlayType: string) => void,
    startCloud: (showName: string, id: string, name: string, listeners: number) => Promise<void>,
}

// Idk, whether it would be better to do this. Tipo calling through parent (App.jsx) closing and opening overlays
// https://medium.com/@nugen/react-hooks-calling-child-component-function-from-parent-component-4ea249d00740
// https://stackoverflow.com/a/37950970/9819103
const Overlays = ({ overlayType, setToggleOverlay, startCloud }: Props) => {
    const [infoIsActive, setInfoIsActive] = useState(false);
    const shouldRenderInfo = useDelayUnmount(infoIsActive, 400);
    const [podcastIsActive, setPodcastIsActive] = useState(false);
    const shouldRenderPodcast = useDelayUnmount(podcastIsActive, 400);
    const [timeoutIsActive, setTimeoutIsActive] = useState(false);

    useEffect(() => {
        // console.log("Overlays use effect", overlayType);
        if (overlayType === 'info') {
            setInfoIsActive(true);
            // setToggleOverlay("");
        } else if (overlayType === 'podcast') {
            setPodcastIsActive(true);
            // setToggleOverlay("");
        } else if (overlayType === 'timeout start') {
            setTimeoutIsActive(true);
        }
        return () => { setToggleOverlay(''); };
    }, [overlayType, setToggleOverlay]);

    return (
        <>
            { shouldRenderInfo && (
                <Info
                    mounting={infoIsActive}
                    onClick={() => {
                        setInfoIsActive(false);
                    }}
                />
            )}

            { shouldRenderPodcast && (
                <Podcast
                    mounting={podcastIsActive}
                    startCloud={startCloud}
                    close={() => {
                        setPodcastIsActive(false);
                    }}
                />
            )}

            { timeoutIsActive && (
                <Timeout
                    onClick={() => {
                        setTimeoutIsActive(false);
                        setToggleOverlay('timeout end');
                    }}
                />
            )}
        </>
    );
};

export default Overlays;
