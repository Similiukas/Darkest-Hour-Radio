import { useEffect, useRef } from 'react';

// TL;DR interval with useEffect(..., []) doesn't get the props or state changes
// That is, once interval is set up, it has only the initial props and state
// So if the state or props changed, the interval callback doesn't have the changes.
// If using useCallback, then the interval callback has changes but the timer is messed up
// Another thing, is that it's declarative and also you can have a dynamic delay.
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export default function useInterval(callback: CallableFunction, delay: number) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const savedCallback = useRef<any>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    // eslint-disable-next-line consistent-return
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
