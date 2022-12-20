import React from "react";
import { useEffect, useState } from "react";
import "./ImgCarousel.css";
import { useStateValue } from "../../Context/stateProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFlip, Virtual, Navigation } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/effect-flip";
import "swiper/css/virtual";

import PlayerCard from "../PlayerCard/PlayerCard";
import { ThemedDiv } from "../../utils/ThemedComponents";

function ImgCarousel() {
  const [{ theme, teamData, authTeam }] = useStateValue();
  const [mobileActive, setMobileActive] = useState({
    boolean: true,
    slidesMobile: 1,
    slidesFull: 3,
  });
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [mobile] = useState(600);

  useEffect(() => {
    let handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    windowSize <= mobile
      ? setMobileActive((m) => ({ ...m, boolean: true }))
      : setMobileActive((m) => ({ ...m, boolean: false }));
  }, [windowSize, mobile ]);

  return (
    <div className="imgCarousel">
      <Swiper
        modules={[Autoplay, Pagination, EffectFlip, Virtual, Navigation]}
        spaceBetween={0}
        slidesPerView={
          mobileActive.boolean
            ? mobileActive.slidesMobile
            : mobileActive.slidesFull
        }
        autoplay={{ delay: 10000 }}
        pagination={{ clickable: true }}
        navigation={true}
        loopFillGroupWithBlank={true}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        virtual
      >
        {teamData
          ? teamData.players.map((player, index) =>
              player.oImage || player.dImage ? (
                <SwiperSlide key={player.number} virtualIndex={index}>
                  <PlayerCard
                    firstName={player.firstName}
                    lastName={player.lastName}
                    number={player.number}
                    offenseImage={player.oImage}
                    defenseImage={player.dImage}
                    logo={authTeam ? authTeam.teamLogo : teamData.logo}
                  />
                </SwiperSlide>
              ) : null
            )
          : null}
      </Swiper>
    </div>
  );
}

export default ImgCarousel;
