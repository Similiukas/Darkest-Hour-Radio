import { useState, useEffect } from 'react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import PodcastShowRecording from './PodcastShowRecording';

import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';

type Props = {
    mounting: boolean,
    startCloud: (showName: string, id: string, name: string, listeners: number) => Promise<void>,
    close: () => void,
}

SwiperCore.use([Navigation, Pagination]);

async function getRecordList() {
    return fetch('http://127.0.0.1:3002/recordList')
    .then((response) => response.json())
    .catch((err) => {
        console.error('Error fetching record list', err);
    });
}

const Podcast = ({ mounting, startCloud, close }: Props) => {
    const [activeShowID, setActiveShowID] = useState(-1);
    const [firstShowRecords, setFirstShowRecords] = useState([]);
    const [secondShowRecords, setSecondShowRecords] = useState([]);

    const callCloud = (showName: string, id: string, name: string, listeners: number) => {
        startCloud(showName, id, name, listeners);
        close();
    };

    useEffect(() => {
        let results;
        async function fetchData() {
            results = await getRecordList();
            setFirstShowRecords(results['test show 1']);
            setSecondShowRecords(results['test-show-2']);
            setActiveShowID(0);
            console.log('Results:', results, results['test show 1']);
        }
        fetchData();
    }, []);

    return (
        <div className={`overlay podcasts ${mounting ? '' : 'fade-out'}`}>
            <div id="podcast-description">
                <h3>Something here podcasts</h3>
                <p>Missed live show? Don&apos;t worry, now you can listen to your favourite shows anytime you want!</p>
                <span id="podcast-close-button" className="material-icons md-36" role="button" tabIndex={0} onClick={close}>cancel</span>
            </div>
            <div id="podcast-main">
                <div id="podcast-show-buttons">
                    <button className={activeShowID === 0 ? 'active' : ''} onClick={() => setActiveShowID(0)} type="button">Button here</button>
                    <button className={activeShowID === 1 ? 'active' : ''} onClick={() => setActiveShowID(1)} type="button">Another show</button>
                    <button className={activeShowID === 2 ? 'active' : ''} type="button">Third show</button>
                </div>
                <div id="podcast-show-description">
                    { activeShowID === 0 && (
                        <div>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate aliquid molestias <br />praesentium tenetur? Ut harum dicta blanditiis fuga ea sequi dele
                        </div>
                    )}
                    { activeShowID === 1 && (
                        <div>
                            This is a different text about another show which features these hosts and is about some really cool music I guess and some talks
                        </div>
                    )}
                </div>
                <div id="podcast-recordings-container">
                    { activeShowID === 0 && (
                        <Swiper
                            className="podcast-show"
                            direction={window.innerWidth > 1025 ? 'horizontal' : 'vertical'}
                            spaceBetween={window.innerWidth > 1025 ? 20 : 10}
                            slidesPerView={window.innerWidth > 1025 ? 4 : 2}
                            freeMode
                            freeModeSticky
                            loop={false}
                            navigation={window.innerWidth > 1025}
                            pagination={{ clickable: true }}
                        >
                            { firstShowRecords.map((show: any) => (
                                <SwiperSlide>
                                    <PodcastShowRecording
                                        key={show.id}
                                        id={show.id}
                                        show="first show 1"
                                        text={show.name}
                                        listeners={show.listeners}
                                        length={show.length}
                                        date={show['creation-date']}
                                        callCloud={callCloud}
                                    />
                                </SwiperSlide>
                            ))}
                            {/* <SwiperSlide><PodcastShowRecording id={"A1"} text={"First show 1"} callCloud={callCloud}/></SwiperSlide>
                        <SwiperSlide><PodcastShowRecording id={"A2"} text={"First show 2"} /></SwiperSlide>
                        <SwiperSlide><PodcastShowRecording id={"A3"} text={"First show 3"} /></SwiperSlide>
                        <SwiperSlide><PodcastShowRecording id={"A4"} text={"First show 4"} /></SwiperSlide>
                        <SwiperSlide><PodcastShowRecording id={"A5"} text={"First show 5"} /></SwiperSlide> */}
                        </Swiper>
                    )}
                    { activeShowID === 1 && (
                        <Swiper
                            className="podcast-show"
                            direction={window.innerWidth > 1025 ? 'horizontal' : 'vertical'}
                            spaceBetween={window.innerWidth > 1025 ? 20 : 10}
                            slidesPerView={window.innerWidth > 1025 ? 4 : 2}
                            freeMode
                            freeModeSticky
                            loop={false}
                            navigation={window.innerWidth > 1025}
                            pagination={{ clickable: true }}
                        >
                            { secondShowRecords.map((show: any) => (
                                <SwiperSlide>
                                    <PodcastShowRecording
                                        key={show.id}
                                        id={show.id}
                                        show="first show 1"
                                        text={show.name}
                                        listeners={show.listeners}
                                        length={show.length}
                                        date={show['creation-date']}
                                        callCloud={callCloud}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Podcast;
