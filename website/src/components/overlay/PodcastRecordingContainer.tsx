import { Swiper, SwiperSlide } from 'swiper/react';

import Loader from 'components/Loader';

import PodcastShowRecording from './PodcastShowRecording';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
    activeShowID: number,
    podcasts: Podcast[] | null,
    callCloud: (showName: string, id: string, listeners: string) => void,
}

const PodcastRecordingContainer = ({ activeShowID, podcasts, callCloud }: Props) => (
    <div id="podcast-recordings-container">
        { podcasts && (
            <Swiper
                className="podcast-show"
                direction={window.innerWidth > 1025 ? 'horizontal' : 'vertical'}
                spaceBetween={window.innerWidth > 1025 ? 20 : 10}
                slidesPerView={window.innerWidth > 1025 ? 4 : 2}
                freeMode
                // freeModeSticky
                loop={false}
                navigation={window.innerWidth > 1025}
                pagination={{ clickable: true }}
                observer // So Swiper reinitializes on slide changes
            >
                {/* { podcasts[activeShowID].recordings.map((show) => (
                    <SwiperSlide key={show.name}>
                        <PodcastShowRecording
                            key={show.name}
                            showName={podcasts[activeShowID].name}
                            name={show.name}
                            listeners={show.listeners.toString().padStart(2, '0')}
                            length={show.length}
                            date={show['creation-date']}
                            callCloud={callCloud}
                        />
                    </SwiperSlide>
                ))} */}
                {/* TODO: temporary showing this way the main shows until there are more of them */}
                {podcasts.map((show) => (
                    <SwiperSlide key={show.name + activeShowID}>
                        <PodcastShowRecording
                            key={show.name}
                            showName={show.name}
                            name={show.recordings[0].name}
                            listeners={show.recordings[0].listeners.toString().padStart(2, '0')}
                            length={show.recordings[0].length}
                            date={show.recordings[0]['creation-date']}
                            callCloud={callCloud}
                        />
                    </SwiperSlide>
                ))}
                {/* <>
                    <SwiperSlide>
                        <PodcastShowRecording
                            key={podcasts[0].recordings[0].name}
                            showName={podcasts[activeShowID].name}
                            name={podcasts[0].recordings[0].name}
                            listeners={podcasts[0].recordings[0].listeners.toString().padStart(2, '0')}
                            length={podcasts[0].recordings[0].length}
                            date={podcasts[0].recordings[0]['creation-date']}
                            callCloud={callCloud}
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <PodcastShowRecording
                            key={podcasts[1].recordings[0].name}
                            showName={podcasts[activeShowID].name}
                            name={podcasts[1].recordings[0].name}
                            listeners={podcasts[1].recordings[0].listeners.toString().padStart(2, '0')}
                            length={podcasts[1].recordings[0].length}
                            date={podcasts[1].recordings[0]['creation-date']}
                            callCloud={callCloud}
                        />
                    </SwiperSlide>
                </> */}
            </Swiper>
            // <div className="podcast-show">

        // </div>
        )}
        {!podcasts && <Loader />}
    </div>
);

export default PodcastRecordingContainer;
