import React from "react";
import { useStateValue } from "../../Context/stateProvider";
import PlayersImgs from "./PlayersImgs";

function ImgsPreviewList() {

  const [{ authPlayers }] = useStateValue();
  return (
    <>
      {authPlayers &&
        authPlayers.players.map((player) => (
          <PlayersImgs
            key={Math.random()}
            firstName={player.firstName}
            lastName={player.lastName}
            playerImg={player.headshotImg.secureURL}
            playerOffenseImg={player.offenseImg.secureURL}
            playerDefenseImg={player.defenseImg.secureURL}
          />
        ))}
    </>
  );
}

export default ImgsPreviewList;
