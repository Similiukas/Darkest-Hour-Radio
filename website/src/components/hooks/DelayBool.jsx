import { useState, useEffect } from 'react';

export const useDelayBool = (dependency, delay) => {
    const [bool, setBool] = useState(false);

    useEffect(() => {
        setBool(false);
        const timer = setTimeout(() => setBool(true), delay);
        return () => clearTimeout(timer);
    }, [dependency, delay])

    return bool;
}
