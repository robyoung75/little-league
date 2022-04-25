import React, { useState, useEffect } from "react";
import "./TeamSignUp.css";
import TeamForm from "../../Components/Forms/TeamForm";
import TeamFormPreview from "../../Components/Forms/TeamFormPreview";
import { checkLocalData } from "../../assets/functions";
function TeamSignUp() {
  const [teamData, setTeamData] = useState();
  const [newTeamData, setNewTeamData] = useState(false);

  useEffect(() => {
    checkLocalData("team data", setTeamData);

    window.addEventListener("localTeam", checkLocalData);
    return () => {
      window.removeEventListener("localTeam", checkLocalData);
    };
  }, [newTeamData]);
  return (
    <div className="teamSignUp">
      <div className="teamSignUp__left">
        <TeamForm setNewTeamData={setNewTeamData} newTeamData={newTeamData} />
      </div>
      <div className="teamSignUp__right">
        <TeamFormPreview teamData={teamData} />
      </div>
    </div>
  );
}

export default TeamSignUp;
