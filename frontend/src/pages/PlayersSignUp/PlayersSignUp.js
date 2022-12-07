import React, { useState, useEffect } from "react";
import "./PlayersSignUp.css";
import PlayersForm from "../../Components/Forms/PlayersForm";
import PlayersFormPreview from "../../Components/Forms/PlayersFormPreview";
import { checkLocalData } from "../../assets/functions";
import { useStateValue } from "../../Context/stateProvider";
import { authUserGetPlayers } from "../../assets/requests";

function PlayersSignUp() {
  const [playersData, setPlayersData] = useState();
  const [newPlayersData, setNewPlayersData] = useState(false);
  const [{ authUser }, dispatch] = useStateValue();

  useEffect(() => {
    checkLocalData("playersData", setPlayersData);

    window.addEventListener("localPlayers", checkLocalData);
    return () => {
      window.removeEventListener("localPlayers", checkLocalData);
    };
  }, [newPlayersData]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      const playersData = await authUserGetPlayers(authUser.teamId);

      dispatch({
        type: "SET_AUTH_PLAYERS",
        authPlayers: playersData.data,
      });
    };

    if (isSubscribed && authUser) {
      fetchData().catch(console.error);
    }

    return () => {
      isSubscribed = false;
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
