import { useRef, useEffect } from 'react';

import full from 'images/cassette.webm';
import pixels from 'pixels.json';

type Props = {
    templateRatio: number,
    playing: boolean
};

// Command for conversion: (where input files are 1.png, 2.png, etc. or just use *.gif)
// ffmpeg -y -i %d.png -r 30 -c:v libvpx-vp9 -quality good -cpu-used 0 -b:v 500K -crf 12 -pix_fmt yuva420p -movflags faststart out.webm
const Cassette = ({ templateRatio, playing }: Props) => {
    const width = window.innerWidth > 1025 ? templateRatio * pixels.Cassette.width : undefined;
    const height = window.innerWidth > 1025 ? templateRatio * pixels.Cassette.height : undefined;
    const marginLeft = window.innerWidth > 1025 ? templateRatio * pixels.Cassette.marginLeft : undefined;
    const marginTop = window.innerWidth > 1025 ? templateRatio * pixels.Cassette.marginTop : undefined;

    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (playing) {
                videoRef.current.play();
                // videoRef.current.playbackRate = 1.2;
            } else {
                videoRef.current.pause();
            }
        }
    }, [playing]);

    return (
        <div style={{
            position: 'absolute',
            width,
            height,
            marginLeft,
            marginTop,
        }}
        >
            <video ref={videoRef} loop muted playsInline style={{ width: '100%' }}>
                <source src={full} type="video/webm" />
            </video>
        </div>
    );
};

export default Cassette;
