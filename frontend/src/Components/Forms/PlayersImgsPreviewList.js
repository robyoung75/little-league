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
            playerImg={player.headshotImg}
            playerOffenseImg={player.offenseImg}
            playerDefenseImg={player.defenseImg}
          />
        ))}
    </>
  );
}

export default ImgsPreviewList;
