import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Images
import ImgBanner1 from "/src/assets/img/banner5-1.jpg";
import ImgBanner2 from "/src/assets/img/banner5-2.png";
import ImgBanner3 from "/src/assets/img/banner5-3.png";
import ImgBanner4 from "/src/assets/img/banner5-4.png";
import ImgBanner5 from "/src/assets/img/banner5-4.png";
import ImgBanner6 from "/src/assets/img/banner5-5.jpg";

const Slideshow = () => {
    const slides = [
        { id: 0, image: ImgBanner1 },
        { id: 1, image: ImgBanner2 },
        { id: 2, image: ImgBanner3 },
        { id: 3, image: ImgBanner4 },
        { id: 4, image: ImgBanner5 },
        { id: 5, image: ImgBanner6 },
    ];

    return (
        <div className="home_slider">
            {/* Swiper Container */}
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    el: '.swiper-pagination',
                    clickable: true,
                }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                className="banners-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <img
                            src={slide.image}
                            alt={`Banner ${slide.id + 1}`}
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                objectFit: 'cover',
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Pagination Dots (below slider) */}
            <div className="swiper-pagination"></div>

            {/* Navigation Arrows */}
            <div className="navigate-wrapper navigate-bottom">
                <div type="button" className="swiper-button-prev">
                    <svg className="icon icon-arrowLeft" viewBox="0 0 24 24" width="24" height="24">
                        <title>Previous</title>
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                    </svg>
                </div>

                <div type="button" className="swiper-button-next">
                    <svg className="icon icon-arrowRight" viewBox="0 0 24 24" width="24" height="24">
                        <title>Next</title>
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Slideshow;