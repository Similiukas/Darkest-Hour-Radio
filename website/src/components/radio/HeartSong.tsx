import { useState, useEffect } from 'react';

import { useDidMount, useInterval } from 'hooks';
import pixels from 'pixels.json';
import { parseMetadata } from 'utils';

type Props = {
    templateRatio: number,
    currentSong: string,
}

// https://nameless-citadel-71535.herokuapp.com/song
async function getHearts(songName: string) {
    return fetch(`http://192.168.0.52:3002/song/${songName}`, {
        mode: 'cors',
        method: 'GET',
    })
    .then((res) => {
        if (res.ok) return res.text();
        // This happens if the server responds with an error
        throw new Error('Something wrong');
    })
    .catch((err) => {
        // This happens if the server is down
        console.info('Error getting hearts for song', songName, err.message);
        return '0';
    });
}

function postHearts(songName: string, unheart: boolean) {
    fetch(`http://localhost:3002/${unheart ? 'un' : ''}song/${songName}`, {
        mode: 'cors',
        method: 'POST',
    })
    .catch((err) => console.log('Server err', err.message));
}

// eslint-disable-next-line no-undef
// let timer: NodeJS.Timer;

const HeartSong = ({ templateRatio, currentSong }: Props) => {
    const width = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.width : undefined;
    const height = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.height : undefined;
    const marginLeft = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.marginLeft : undefined;
    const marginTop = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.marginTop : undefined;

    const [active, setActive] = useState(false);
    const [hearts, setHearts] = useState(0);

    const handleHeartClick = () => {
        const parsedSong = parseMetadata(currentSong);
        if (parsedSong) postHearts(`${parsedSong[1]} ${parsedSong[2]}`, active);
        sessionStorage.setItem('currentSong', active ? '0' : '1');
        setActive(!active);
    };

    const handleGetHearts = async (forceNonActive: boolean, forceActive: boolean) => {
        console.log(new Date(), currentSong, active);
        if (currentSong !== '' && currentSong !== 'ad') {
            const parsedSong = parseMetadata(currentSong);
            if (parsedSong) {
                getHearts(`${parsedSong[1]} ${parsedSong[2]}`).then((res) => {
                    console.log('res', res, active, forceNonActive, (forceNonActive || !active) && !forceActive);
                    // Since we update hearts with active (and not making a post then a get request for updated value)
                    // Need to subtract 1 if the heart is active. However, for some reason when the song changes
                    // Active state doesn't change in time thus need to force non active to not subtract hearts on the new song
                    // This might be because this is a promise call, though prolly isn't (quickly tested)
                    setHearts((forceNonActive || !active) && !forceActive ? parseInt(res) : parseInt(res) - 1);
                });
            }
        }
    };

    // Checking hearts every 5 seconds.
    useInterval(() => handleGetHearts(false, false), 5 * 1000);

    useDidMount(() => {
        if (currentSong !== '' && currentSong !== 'ad') {
            setActive(false);
            handleGetHearts(true, false);
            sessionStorage.removeItem('currentSong');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong]);

    // We check if on page reload the song has already been hearted
    useEffect(() => {
        if (sessionStorage.getItem('currentSong') === '1') {
            setActive(true);
            handleGetHearts(false, true);
        } else {
            handleGetHearts(false, false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className="heart-song"
            role="button"
            tabIndex={-1}
            onClick={handleHeartClick}
            style={{
                width,
                height,
                marginLeft,
                marginTop,
            }}
        >
            <span className={`heart ${active ? 'active' : ''}`}>&hearts;</span>
            <span className="amount">{active ? hearts + 1 : hearts}</span>
        </div>
    );
};

export default HeartSong;
