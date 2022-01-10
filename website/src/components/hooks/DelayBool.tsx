import React, { useState, useEffect } from 'react';

export const useDelayBool = (delay: number, dependency?: React.DependencyList) => {
    const [bool, setBool] = useState(false);

    useEffect(() => {
        setBool(false);
        const timer = setTimeout(() => setBool(true), delay);
        return () => clearTimeout(timer);
    }, [dependency, delay])

    return bool;
}
