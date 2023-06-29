import { useState, useEffect } from 'react';
import SwiperCore, { Navigation, Pagination } from 'swiper';

import { playSoundFX } from 'utils';

import PodcastRecordingContainer from './PodcastRecordingContainer';

type Props = {
    mounting: boolean,
    startCloud: StartCloudRecoding,
    close: () => void,
}

SwiperCore.use([Navigation, Pagination]);

async function getRecordList(): Promise<Podcast[]> {
    return fetch(`${process.env.REACT_APP_REMOTE_API_URL}/recordList`)
    .then((response) => response.json())
    .catch((err) => {
        console.error('Error fetching record list', err);
    });
}

const PodcastContainer = ({ mounting, startCloud, close }: Props) => {
    const [activeShowID, setActiveShowID] = useState(-1);
    const [podcasts, setPodcasts] = useState<Podcast[] | null>(null);

    const callCloud = (showName: string, id: string, listeners: string) => {
        playSoundFX('CassetteInsert');
        startCloud(showName, id, listeners);
        close();
    };

    useEffect(() => {
        async function fetchData() {
            const results = await getRecordList();
            setActiveShowID(0);
            setPodcasts(results);
            console.log(results);
        }
        fetchData();
    }, []);

    return (
        <div className={`overlay podcasts ${mounting ? '' : 'fade-out'}`}>
            <div id="podcast-description">
                <h3>Podcasts</h3>
                <p>Missed live show? Don&apos;t worry, now you can listen to your favourite shows anytime you want!</p>
                <span id="podcast-close-button" className="material-icons md-36" role="button" tabIndex={0} onClick={close}>cancel</span>
            </div>
            <div id="podcast-main">
                {/* <div id="podcast-show-buttons">
                    <button className={activeShowID === 0 ? 'active' : ''} onClick={() => setActiveShowID(0)} type="button" style={{ borderRadius: '10px 0 0 10px' }}>
                        Evening Vibes
                    </button>
                    <button className={activeShowID === 1 ? 'active' : ''} onClick={() => setActiveShowID(1)} type="button" style={{ borderRadius: '0 10px 10px 0' }}>
                        Memento
                    </button>
                    <button className={activeShowID === 2 ? 'active' : ''} type="button">Third show</button>
                </div> */}
                <div id="podcast-show-description">
                    { activeShowID === 0 && (
                        <div>
                            {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate aliquid molestias <br />praesentium tenetur? Ut harum dicta blanditiis fuga ea sequi dele */}
                        </div>
                    )}
                    { activeShowID === 1 && (
                        <div>
                            This is a different text about another show which features these hosts and is about some really cool music I guess and some talks
                        </div>
                    )}
                </div>
                <PodcastRecordingContainer
                    activeShowID={activeShowID}
                    podcasts={podcasts}
                    callCloud={callCloud}
                />
            </div>
        </div>
    );
};

export default PodcastContainer;
