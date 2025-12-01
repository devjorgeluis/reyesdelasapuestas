import { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import IconLoading from "/src/assets/img/miniloader.png";

const ArcadeSlideshow = ({ games, name, title, onGameClick }) => {
    const { contextData } = useContext(AppContext);
    const swiperRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [swiperReady, setSwiperReady] = useState(false);

    // Initialize navigation after component mounts
    useEffect(() => {
        if (swiperRef.current && swiperReady) {
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();

            // Initial state update
            setIsBeginning(swiperRef.current.isBeginning);
            setIsEnd(swiperRef.current.isEnd);
        }
    }, [swiperReady]);

    // Update navigation state when games change
    useEffect(() => {
        if (swiperRef.current && swiperReady) {
            setTimeout(() => {
                swiperRef.current.update();
                swiperRef.current.navigation.update();
                setIsBeginning(swiperRef.current.isBeginning);
                setIsEnd(swiperRef.current.isEnd);
            }, 100);
        }
    }, [games, swiperReady]);

    return (
        <div className="home-block home_leagues">
            <div className="home-block__header">
                <div className="home-block__title">{title}</div>
            </div>
            <div className="home-block__content">
                {
                    games.length === 0 ? (
                        <div className="home-block__loader">
                            <img src={IconLoading} />
                        </div>
                    ) :
                        <div className="swiper home_block_swiper swiper-initialized swiper-horizontal swiper-pointer-events swiper-backface-hidden">
                            <div
                                className={`swiper-custom-nav left ${name}-navigate-next navigate-prev ${isBeginning ? 'swiper-button-disabled' : ''}`}
                                aria-label="Previous slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="21" height="21" viewBox="0 0 492 492">
                                    <path d="M198.608 246.104 382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z"></path>
                                </svg>
                            </div>

                            <Swiper
                                modules={[Navigation]}
                                slidesPerView={5}
                                spaceBetween={15}
                                navigation={{
                                    nextEl: "." + name + "-navigate-next",
                                    prevEl: "." + name + "-navigate-prev",
                                }}
                                loop={true}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 3,
                                    },
                                    992: {
                                        slidesPerView: 6,
                                    },
                                }}
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
                                    setSwiperReady(true);
                                }}
                                onSlideChange={(swiper) => {
                                    setIsBeginning(swiper.isBeginning);
                                    setIsEnd(swiper.isEnd);
                                }}
                                onInit={(swiper) => {
                                    swiper.navigation.init();
                                    swiper.navigation.update();
                                }}
                            >
                                {games.map((game) => (
                                    <SwiperSlide key={game.id} className="swiper-slide league">
                                        <a
                                            onClick={() => onGameClick && onGameClick(game)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="league__icon" style={{ backgroundImage: `url(${game.image_local != null && game.image_local !== "" ? contextData.cdnUrl + game.image_local : game.image_url})` }}></div>
                                            <div className="league__desc">
                                                <div className="league__title">{game.name}</div>
                                                <div className="league__sport">{game.plays}</div>
                                            </div>
                                        </a>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <div
                                className={`swiper-custom-nav right ${name}-navigate-next navigate-next ${isEnd ? 'swiper-button-disabled' : ''}`}
                                aria-label="Next slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="21" height="21" viewBox="0 0 492.004 492.004">
                                    <path d="M382.678 226.804 163.73 7.86C158.666 2.792 151.906 0 144.698 0s-13.968 2.792-19.032 7.86l-16.124 16.12c-10.492 10.504-10.492 27.576 0 38.064L293.398 245.9l-184.06 184.06c-5.064 5.068-7.86 11.824-7.86 19.028 0 7.212 2.796 13.968 7.86 19.04l16.124 16.116c5.068 5.068 11.824 7.86 19.032 7.86s13.968-2.792 19.032-7.86L382.678 265c5.076-5.084 7.864-11.872 7.848-19.088.016-7.244-2.772-14.028-7.848-19.108z"></path>
                                </svg>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default ArcadeSlideshow;