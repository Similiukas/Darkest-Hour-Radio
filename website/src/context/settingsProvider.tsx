import { FC, useState, useCallback } from 'react';

import { OverlayType, ScheduleInfo } from 'types';

import { DEFAULT_SETTINGS, SettingsContext } from './settingsContext';

// Right now, the context uses simple state but it would be better to memoize these values
// This is because everytime the context state changes, all the child components are re-rendered
// Hence using useCallback with useMemo can be beneficial for optimizing.
// But it's not necessary and using useMemo can lead to worse performance if it's not used properly.
// https://devtrium.com/posts/how-use-react-context-pro#be-careful-about-updating-context-values-and-memoize-them
// https://wanago.io/2020/09/28/react-context-api-hooks-typescript/ <- this is a good example of context
// https://kentcdodds.com/blog/how-to-use-react-context-effectively

// eslint-disable-next-line import/prefer-default-export
export const SettingsProvider: FC = ({ children }) => {
    const [overlayType, setOverlayType] = useState<OverlayType>(DEFAULT_SETTINGS.overlayType);
    const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo[]|undefined>(DEFAULT_SETTINGS.scheduleInfo);

    // const setOverlay = useCallback((overlayType: OverlayType) => {
    //     setOverlayType(overlayType);
    // }, []);

    // NodeJS.Timeout: https://stackoverflow.com/a/50428377
    // eslint-disable-next-line no-undef
    const [playbackTimeoutID, setPlaybackTimeoutID] = useState<NodeJS.Timeout|null>(null);

    const toggleTimeout = useCallback(() => {
        if (playbackTimeoutID !== null) {
            clearTimeout(playbackTimeoutID);
            setPlaybackTimeoutID(null);
        } else {
            setPlaybackTimeoutID(setTimeout(setOverlayType, 2.6 * 60 * 60 * 1000, OverlayType.TimeoutStart));
        }
    }, [playbackTimeoutID]);

    // const value = useMemo(() => ({
    //     overlayType,
    //     setOverlay,
    //     playbackTimeoutID,
    //     toggleTimeout,
    // }), [playbackTimeoutID, toggleTimeout, overlayType, setOverlay]);

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <SettingsContext.Provider value={{ overlayType, setOverlay: setOverlayType, toggleTimeout, scheduleInfo, setScheduleInfo }}>
            {children}
        </SettingsContext.Provider>
    );
};
