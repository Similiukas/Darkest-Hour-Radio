import { Swiper, SwiperSlide } from 'swiper/react';

import Loader from 'components/Loader';
import { Podcast } from 'types';

import PodcastShowRecording from './PodcastShowRecording';

import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';

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
                freeModeSticky
                loop={false}
                navigation={window.innerWidth > 1025}
                pagination={{ clickable: true }}
                observer // So Swiper reinitializes on slide changes
            >
                { podcasts[activeShowID].recordings.map((show) => (
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
                ))}
            </Swiper>
        )}
        { !podcasts && <Loader />}
    </div>
);

export default PodcastRecordingContainer;
