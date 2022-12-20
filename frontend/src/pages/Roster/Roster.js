import React from "react";
import "./Roster.css";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedDiv } from "../../utils/ThemedComponents";
import PlayerCard from "../../Components/PlayerCard/PlayerCard";

function Roster({ isActive }) {
  const [{ teamData, theme, authPlayers, authTheme, authTeam }] =
    useStateValue();

  return (
    <div className={isActive ? "roster roster__active" : "roster"}>
      <h1>
        {authTeam
          ? `Meet the 2022 ${authTeam.teamName
              .charAt(0)
              .toUpperCase()}${authTeam.teamName.slice(1)}`
          : `Meet the 2022 ${teamData.team
              .charAt(0)
              .toUpperCase()}${teamData.team.slice(1)}`}
      </h1>

      {teamData &&
        teamData.players.map((player) => (
          <div className="roster__flipCard" key={player.number}>
            <div className="roster__flipCardInner">
              <ThemedDiv theme={authTheme} className="roster__flipCardFront">
                <PlayerCard
                  logo={authTeam ? authTeam.teamLogo : teamData.logo}
                  offenseImage={player.oImage}
                  defenseImage={player.dImage}
                  firstName={player.firstName}
                  lastName={player.lastName}
                  number={player.number}
                  image={player.image}
                />
              </ThemedDiv>
              <ThemedDiv className="roster__flipCardBack">
                <ThemedDiv
                  theme={authTheme}
                  className="roster__flipCardBackContainer"
                >
                  <img
                    className="roster__flipCardBackContentImg"
                    src={player.image}
                    alt="player"
                  ></img>
                  <h3>
                    #{player.number} {player.firstName} {player.lastName}
                  </h3>
                  <div className="roster__flipCardBackContent">
                    <p>Postions: {player.position}</p>
                    <p>Games Played: {player.gamesPlayed}</p>
                    <p>At Bats: {player.atBats}</p>
                    <p>Batting Ave: {player.battingAve}</p>
                    <p>OPS: {player.OPS}</p>
                    <p>RBIs: {player.rbi}</p>
                    <p>Runs: {player.runs}</p>
                  </div>
                </ThemedDiv>
              </ThemedDiv>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Roster;
