import { useState, useEffect } from 'react';

// A simple delay of unmounting for animation
// Can use something like https://github.com/jlkiri/use-animate-presence for more sophisticated animations if needed
// https://stackoverflow.com/a/54114180/9819103
// eslint-disable-next-line import/prefer-default-export
export function useDelayUnmount(isMounted: boolean, delayTime: number) {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line no-undef
        let timeoutId: NodeJS.Timeout;
        if (isMounted && !shouldRender) {
            setShouldRender(true);
        } else if (!isMounted && shouldRender) {
            timeoutId = setTimeout(() => setShouldRender(false), delayTime);
        }
        return () => clearTimeout(timeoutId);
    }, [isMounted, delayTime, shouldRender]);
    return shouldRender;
}
