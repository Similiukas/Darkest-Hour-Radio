import { createContext } from 'react';

interface SettingsProps {
    overlayType: OverlayType;
    scheduleInfo: ScheduleInfo[] | undefined;
    setOverlay: (overlayType: OverlayType) => void;
    toggleTimeout: () => void;
    setScheduleInfo: (schedule: ScheduleInfo[]) => void;
}

export const DEFAULT_SETTINGS: SettingsProps = {
    overlayType: 'Empty',
    scheduleInfo: undefined,
    setOverlay: () => undefined,
    toggleTimeout: () => undefined,
    setScheduleInfo: () => undefined,
};

// eslint-disable-next-line import/prefer-default-export
export const SettingsContext = createContext<SettingsProps>(DEFAULT_SETTINGS);
