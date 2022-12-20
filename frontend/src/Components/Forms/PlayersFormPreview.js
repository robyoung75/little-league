import React, { useState } from "react";
import PlayersImgsPreviewList from "./PlayersImgsPreviewList";
import { handleDelete } from "../../assets/functions";
import { ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";

function PlayersFormPreview({ setPlayersData }) {
  const [{ authTheme, authPlayers }] = useStateValue();

  return (
    <div className="playersFormPreview formPreview form">
      <h3>Player data</h3>
      <div className="playersFormPreview previewContainer form">
        <table className="formPreview__table ">
          <thead>
            <tr className="formPreview__tr">
              <th className="formPreview__th images">First name</th>
              <th className="formPreview__th">Last name</th>
              <th className="formPreview__th">Number</th>
              <th className="formPreview__th">Positions</th>
              <th className="formPreview__th">Batting stance</th>
            </tr>
          </thead>
          <tbody>
            {authPlayers &&
              authPlayers.players.map((player, i) => (
                <tr className="formPreview__tr" key={i}>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {player.firstName}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {player.lastName}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">{player.number}</div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {player.positions.map((position) => position + " ")}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      {player.battingStance.map((stance) => stance + " ")}
                    </div>
                  </td>
                  <td className="formPreview__td">
                    <div className="formPreview__content">
                      <ThemedButton
                        className="formDelete"
                        theme={authTheme}
                        onClick={(e) =>
                          handleDelete(player, setPlayersData, "players data")
                        }
                      >
                        Delete
                      </ThemedButton>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <h3>Player data images</h3>
      <div className="playersFormPreview previewContainer form">
        <table className="formPreview__table" >
          <thead>
            <tr className="formPreview__tr" >
              <th className="formPreview__th">First name</th>
              <th className="formPreview__th">Last name</th>
              <th className="formPreview__th">Headshot</th>
              <th className="formPreview__th">Offense Image</th>
              <th className="formPreview__th">Defense Image</th>
            </tr>
          </thead>
          <PlayersImgsPreviewList />
        </table>
      </div>
    </div>
  );
}

export default PlayersFormPreview;
