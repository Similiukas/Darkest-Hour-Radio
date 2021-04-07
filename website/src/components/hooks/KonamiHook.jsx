import { useState, useEffect } from 'react';

export function useKonamiCode(handler) {
    // State to hold array of recently pressed keys
    const [keys, setKeys] = useState([]);

    // Convert stored keys to string and match against konami code string
    const isKonamiCode = keys.join(' ') === "ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a";

    useEffect(() => {
        let timeout;
        // When a key is pressed
        window.document.onkeydown = (e) => {
            // Update array of keys in state with new key
            setKeys((currentKeys) => [...currentKeys, e.key]);
            // Clear 5s timeout since key was just pressed
            clearTimeout(timeout);
            // Reset keys if 5s passes so user can try again
            timeout = setTimeout(() => setKeys([]), 5000);
        };
    }, []);

    // Once konami code is entered call handler function
    // and reset keys so user can do it again.
    useEffect(() => {
        if (isKonamiCode) {
            handler();
            setKeys([]);
        }
    }, [isKonamiCode, handler]);

    return isKonamiCode;
}