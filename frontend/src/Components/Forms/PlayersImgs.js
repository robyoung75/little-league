import React from "react";
import "./Forms.css";

function PlayersImgs({
 
  firstName,
  lastName,
  playerImg,
  playerOffenseImg,
  playerDefenseImg,
}) {
  return (
    <tbody>
      <tr>
        <td className="formPreview__td">{firstName}</td>
        <td className="formPreview__td ">{lastName}</td>
        <td>
          <div className="form">
            {playerImg ? (
              <img className="imgFileInput__img" alt="player" src={playerImg} />
            ) : (
              <p>No headshot selected</p>
            )}
          </div>
        </td>
        <td>
          <div className="form">
            {playerOffenseImg ? (
              <img
                className="imgFileInput__img"
                alt="offense image"
                src={playerOffenseImg}
              />
            ) : (
              <p>No offense image selected</p>
            )}
          </div>
        </td>
        <td>
          <div className="form">
            {playerDefenseImg ? (
              <img
                className="imgFileInput__img"
                alt="defense"
                src={playerDefenseImg}
              />
            ) : (
              <p>No defense image selected</p>
            )}
          </div>
        </td>
      </tr>
    </tbody>
  );
}

export default PlayersImgs;
