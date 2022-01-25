import { createContext } from 'react';

import { OverlayType, ScheduleInfo } from 'types';

interface SettingsProps {
    overlayType: OverlayType;
    scheduleInfo: ScheduleInfo[] | undefined;
    setOverlay: (overlayType: OverlayType) => void;
    toggleTimeout: () => void;
    setScheduleInfo: (schedule: ScheduleInfo[]) => void;
}

export const DEFAULT_SETTINGS: SettingsProps = {
    overlayType: OverlayType.Empty,
    scheduleInfo: undefined,
    setOverlay: () => undefined,
    toggleTimeout: () => undefined,
    setScheduleInfo: () => undefined,
};

// eslint-disable-next-line import/prefer-default-export
export const SettingsContext = createContext<SettingsProps>(DEFAULT_SETTINGS);
