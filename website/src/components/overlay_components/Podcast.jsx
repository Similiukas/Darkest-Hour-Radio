import { useState } from 'react';
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import PodcastShowRecording from "./PodcastShowRecording";
import "swiper/swiper.scss";
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';

SwiperCore.use([Navigation, Pagination]);

const Podcast = ({ mounting, startCloud, close }) => {
    const [activeShowID, setActiveShowID] = useState(0);

    const callCloud = (id, name, listeners) => {
        startCloud(id, name, listeners);
        close();
    }

    return (
        <div className={`overlay podcasts ${mounting ? "" : "fade-out"}`}>
            <div id="podcast-description">
                <h3>Something here podcasts</h3>
                <p>Missed live show? Don't worry, now you can listen to your favourite shows anytime you want!</p>
                <span id="podcast-close-button" className="material-icons md-36" onClick={close}>cancel</span>
            </div>
            <div id="podcast-main">
                <div id="podcast-show-buttons">
                    <button className={activeShowID === 0 ? "active" : ""} onClick={() => setActiveShowID(0)}>Button here</button>
                    <button className={activeShowID === 1 ? "active" : ""} onClick={() => setActiveShowID(1)}>Another show</button>
                    <button className={activeShowID === 2 ? "active" : ""} >Third show</button>
                </div>
                {/* TODO: Text fades-in when changing the show (adding a delay after which adding another class like with messages) */}
                <div id="podcast-show-description">
                    { activeShowID === 0 &&
                        <div>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptate aliquid molestias <br/>praesentium tenetur? Ut harum dicta blanditiis fuga ea sequi dele
                        </div>
                    }
                    { activeShowID === 1 &&
                        <div>
                            This is a different text about another show which features these hosts and is about some really cool music I guess and some talks
                        </div>
                    }
                </div>
                {/* TODO while there aren't enough shows to fill the screen width, don't pust wrapAround. Also check if contain: true is needed */}
                <div id="podcast-recordings-container">
                    { activeShowID === 0 && 
                        <Swiper
                            className="podcast-show"
                            direction={window.innerWidth > 1025 ? "horizontal" : "vertical"}
                            spaceBetween={window.innerWidth > 1025 ? 20 : 10}    // 0 on mobile
                            slidesPerView={window.innerWidth > 1025 ? 4 : 2}   // 2 on mobile
                            freeMode={true}
                            freeModeSticky={true}
                            loop={true}
                            navigation={window.innerWidth > 1025}
                            pagination={{ clickable: true }}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                      >
                        <SwiperSlide><PodcastShowRecording id={"A1"} text={"First show 1"} callCloud={callCloud}/></SwiperSlide>
                        <SwiperSlide><PodcastShowRecording id={"A2"} text={"First show 2"} /></SwiperSlide>
                        <SwiperSlide><PodcastShowRecording id={"A3"} text={"First show 3"} /></SwiperSlide>
                        <SwiperSlide><PodcastShowRecording id={"A4"} text={"First show 4"} /></SwiperSlide>
                        <SwiperSlide><PodcastShowRecording id={"A5"} text={"First show 5"} /></SwiperSlide>
                      </Swiper>
                    }
                    { activeShowID === 1 && 
                        <Swiper
                        className="podcast-show"
                        spaceBetween={50}
                        slidesPerView={4}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}
                      >
                        <SwiperSlide><PodcastShowRecording id={"B1"} text={"Another show 1"} /></SwiperSlide>
                        <SwiperSlide><PodcastShowRecording id={"B2"} text={"Another show 2"} /></SwiperSlide>
                        ...
                      </Swiper>
                    }
                </div>
        </div>
    </div>
    )
}

export default Podcast
