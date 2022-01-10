import React, { useState, useEffect } from 'react';

export const useDelayBool = (delay: number, dependencies?: React.DependencyList) => {
    const [bool, setBool] = useState(false);

    useEffect(() => {
        // console.log("Uhm, cia delay vyksta", delay, dependency);
        
        setBool(false);
        const timer = setTimeout(() => setBool(true), delay);
        return () => clearTimeout(timer);
    }, dependencies);

    return bool;
}
