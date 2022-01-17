import { useState, useEffect } from 'react';

import pixels from 'pixels.json';
import { parseMetadata } from 'utils';

type Props = {
    templateRatio: number,
    currentSong: string | null,
}

// https://nameless-citadel-71535.herokuapp.com/song
async function getHearts(songName: string) {
    return fetch(`https://nameless-citadel-71535.herokuapp.com/song/${songName}`, {
        mode: 'cors',
        method: 'GET',
    })
    // eslint-disable-next-line consistent-return
    .then((res) => { if (res.ok) return res.text(); })
    .catch((err) => console.error('server', err.message));
    // TODO: perziet kaip cia yra su tuo return. Maybe use .finally()
}

function postHearts(songName: string | null) {
    if (!songName) return;
    fetch(`https://nameless-citadel-71535.herokuapp.com/song/${songName}`, {
        mode: 'cors',
        method: 'POST',
    })
    .catch((err) => console.log('Server err', err.message));
}

let lastSong: RegExpMatchArray | undefined;

const HeartSong = ({ templateRatio, currentSong }: Props) => {
    const width = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.width : undefined;
    const height = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.height : undefined;

    const marginLeft = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.marginLeft : undefined;
    const marginTop = window.innerWidth > 1025 ? templateRatio * pixels.HeartSong.marginTop : undefined;

    const [active, setActive] = useState(false);
    const [hearts, setHearts] = useState('0');

    useEffect(() => {
        if (currentSong && currentSong !== '' && currentSong !== 'ad') {
            if (active) {
                console.log('User hearted this song', lastSong);
                setActive(false);
                if (lastSong) {
                    postHearts(`${lastSong[1]} ${lastSong[2]}`);
                }
            }
            lastSong = parseMetadata(currentSong);
            if (lastSong) {
                getHearts(`${lastSong[1]} ${lastSong[2]}`)
                .then((result) => { if (result) setHearts(result); })
                .catch((err) => console.error('Error getting song hearts', err));
            }
            // getHearts(lastSong)
        }
    }, [currentSong]);

    return (
        <div
            className="heart-song"
            role="button"
            tabIndex={-1}
            onClick={() => setActive(!active)}
            style={{
                width,
                height,
                marginLeft,
                marginTop,
            }}
        >
            <span className={`heart ${active ? 'active' : ''}`}>&hearts;</span>
            <span className="amount">{active ? parseInt(hearts) + 1 : parseInt(hearts)}</span>
        </div>
    );
};

export default HeartSong;
