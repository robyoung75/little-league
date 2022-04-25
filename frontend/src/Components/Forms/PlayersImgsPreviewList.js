import React from "react";
import ImgsPreview from "./PlayersImgs";

function ImgsPreviewList({ playersData }) {
  return (
    <>
      {playersData &&
        playersData.map((player) => (
          <ImgsPreview
            key={Math.random()}
            firstName={player.firstName}
            lastName={player.lastName}
            playerImg={player.playerImg}
            playerOffenseImg={player.playerOffenseImg}
            playerDefenseImg={player.playerDefenseImg}
          />
        ))}
    </>
  );
}

export default ImgsPreviewList;
