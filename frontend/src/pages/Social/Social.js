import React from "react";
import "./Social.css";
import ImgCarousel from "../../Components/ImgCarousel/ImgCarousel";
import PlayerList from "../../Components/PlayerList/PlayerList";
import ScheduleList from "../../Components/SocialScheduleList/SocialScheduleList";
import PostInput from "../../Components/PostInput/PostInput";
import PostFeed from "../../Components/PostFeed/PostFeed";

function Social({ isActive, setActive, mobile }) {
  return (
    <div className={isActive ? "social social__active" : "social"}>
      <div className="social__imageCarousel">
        <ImgCarousel mobile={mobile} />
      </div>

      <div className="social__container main">
        <PostInput />
        <PostFeed />
      </div>
      <div className="social__container side__l">
        <PlayerList />
      </div>
      <div className="social__container side__r">
        <ScheduleList />
      </div>
    </div>
  );
}

export default Social;
