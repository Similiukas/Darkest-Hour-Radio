import React, { useState, useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useDelayBool = (delay: number, dependencies?: React.DependencyList) => {
    const [bool, setBool] = useState(false);

    useEffect(() => {
        // console.log("Uhm, cia delay vyksta", delay, dependency);

        setBool(false);
        const timer = setTimeout(() => setBool(true), delay);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);

    return bool;
};
