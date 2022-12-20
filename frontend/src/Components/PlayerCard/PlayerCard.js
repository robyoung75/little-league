import React from "react";
import { useStateValue } from "../../Context/stateProvider";
import "./PlayerCard.css";
import { ThemedDiv } from "../../utils/ThemedComponents";

function PlayerCard({
  logo,
  offenseImage,
  defenseImage,
  firstName,
  lastName,
  number,
  image
}) {
  const [{ authTheme, authTeam }] = useStateValue();
  return (
    <div className="playerCard__container">
      <ThemedDiv theme={authTheme} className="playerCard">
        <img src={logo} alt="team logo" className="playerCard__cardLogo" />
        <img
          src={offenseImage ? offenseImage : defenseImage ? defenseImage : image ? image : null}
          alt="player"
          className="playerCard__playerImg"
        />
        <ThemedDiv theme={authTheme} className="figCaption__container">
          <figcaption>
            <p>
              {firstName} {lastName}
            </p>
            <p>#{number}</p>
          </figcaption>
        </ThemedDiv>
      </ThemedDiv>
    </div>
  );
}

export default PlayerCard;
