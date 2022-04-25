import React, { useState, useEffect } from "react";
import './PlayersSignUp.css'
import PlayersForm from "../../Components/Forms/PlayersForm";
import PlayersFormPreview from "../../Components/Forms/PlayersFormPreview";
import { checkLocalData } from "../../assets/functions";

function PlayersSignUp() {
  const [playersData, setPlayersData] = useState();
  const [newPlayersData, setNewPlayersData] = useState(false);

  useEffect(() => {
    checkLocalData("players data", setPlayersData);

    window.addEventListener("localPlayers", checkLocalData);
    return () => {
      window.removeEventListener("localPlayers", checkLocalData);
    };
  }, [newPlayersData]);
  return (
    <div className="playersSignUp">
      <div className="playersSignUp__left">
        <PlayersForm
          newPlayersData={newPlayersData}
          setNewPlayersData={setNewPlayersData}
        />
      </div>
      <div className="playersSignUp__right">
        <PlayersFormPreview
          playersData={playersData}
          setPlayersData={setPlayersData}
        />
      </div>
    </div>
  );
}

export default PlayersSignUp;
