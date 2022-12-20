import React from "react";
import "./PlayerInfo.css";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedDiv } from "../../utils/ThemedComponents";

function PlayerInfo({ firstName, lastName, number, image, position, batAve }) {
  const [{ authTheme }] = useStateValue();
  return (
    <ThemedDiv theme={authTheme} className="playerInfo">
      <div className="playerInfo__container">
        <img className="playerInfo__img" alt="player info" src={image} />
      </div>
      <div className="playerInfo__container">
        <h5>
          {firstName}, {lastName}
        </h5>
        <p>{position}</p>
      </div>
      <div className="playerInfo__container stats">
        <h5>Ave</h5>
        <p>{batAve}</p>
      </div>
    </ThemedDiv>
  );
}

export default PlayerInfo;
