import { createContext } from 'react';

import { OverlayType } from 'types';

interface SettingsProps {
    overlayType: OverlayType;
    setOverlay: (overlayType: OverlayType) => void,
    toggleTimeout: () => void;
}

export const DEFAULT_SETTINGS: SettingsProps = {
    overlayType: OverlayType.Empty,
    setOverlay: () => undefined,
    toggleTimeout: () => undefined,
};

// eslint-disable-next-line import/prefer-default-export
export const SettingsContext = createContext<SettingsProps>(DEFAULT_SETTINGS);
