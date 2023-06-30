import React, { useState, useEffect } from 'react';

export default function useDelayBool(delay: number, dependencies?: React.DependencyList) {
    const [bool, setBool] = useState(false);

    useEffect(() => {
        setBool(false);
        const timer = setTimeout(() => setBool(true), delay);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return bool;
}
