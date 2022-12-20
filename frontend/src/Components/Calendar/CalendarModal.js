import React from "react";
import { ThemedHeader } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedDiv } from "../../utils/ThemedComponents";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

function CalendarModal({ opponent, arrivalTime, gameTime, address, homeAway }) {
  const [{ authTheme, teamData, gameData }, dispatch] = useStateValue();

  const handleClose = (e) => {
    e.preventDefault();
    dispatch({
      type: "SET_GAME_DATA",
      gameData: null,
    });
  };

  return (
    <>
      {gameData.homeAway === "home" ? (
        <ThemedDiv theme={authTheme} className="calendarModal">
          <ThemedHeader className="calendarModal__header"></ThemedHeader>
          {teamData && (
            <img
              src={teamData.logo}
              alt="logo"
              className="calendarModal__img"
            />
          )}
          <div>
            <p>Opponent: {gameData.opponent}</p>
            <p>Arrival time: {gameData.arrivalTime}</p>
            <p>Game time: {gameData.gameTime}</p>
            <p>Address: {gameData.address}</p>
          </div>

          <FontAwesomeIcon
            style={authTheme.primaryColor}
            icon={faX}
            className="calendarModal__close"
            onClick={handleClose}
          />
        </ThemedDiv>
      ) : (
        <div className="calendarModal">
          <ThemedHeader
            theme={authTheme}
            className="calendarModal__header"
          ></ThemedHeader>
          {teamData && (
            <img
              src={teamData.logo}
              alt="logo"
              className="calendarModal__img"
            />
          )}
          <div>
            <p>Opponent: {gameData.opponent}</p>
            <p>Arrival time: {gameData.arrivalTime}</p>
            <p>Game time: {gameData.gameTime}</p>
            <p>Address: {gameData.address}</p>
          </div>
          <FontAwesomeIcon
            style={authTheme.tertiaryColor}
            icon={faX}
            className="calendarModal__close"
            onClick={handleClose}
          />
        </div>
      )}
    </>
  );
}

export default CalendarModal;
