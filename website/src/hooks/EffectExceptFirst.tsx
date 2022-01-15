import React, { useRef, useEffect } from 'react';

// UseEffect except skipping on first render
// https://stackoverflow.com/a/57941438/9819103
export default function useDidMount(func: CallableFunction, dependencies?: React.DependencyList) {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
        // eslint-disable-next-line
    }, dependencies);
}
