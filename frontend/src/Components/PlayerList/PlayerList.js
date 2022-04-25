import React from "react";
import "./PlayerList.css";
import { useStateValue } from "../../Context/stateProvider";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import { ThemedHeader } from "../../utils/ThemedComponents";

function PlayerList() {
  const [{ theme, teamData }] = useStateValue();
  return (
    <div className="playerList">
      <div className="playerList__headerContainer">
        <ThemedHeader theme={theme} title="Meet the Team" />
      </div>

      {teamData
        ? teamData.players.map((player) => (
            <PlayerInfo
              key={player.number}
              firstName={player.firstName}
              lastName={player.lastName}
              number={player.number}
              image={player.image}
              position={player.position}
              batAve={player.battingAve}
            />
          ))
        : null}
    </div>
  );
}

export default PlayerList;
