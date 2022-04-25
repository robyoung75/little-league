import React, { useState, useEffect } from "react";
import './CompletedForm.css'
import AdminFormPreview from "../../Components/Forms/AdminFormPreview";
import CoachesFormPreview from "../../Components/Forms/CoachesFormPreview";
import PlayersFormPreview from "../../Components/Forms/PlayersFormPreview";
import ScheduleFormPreview from "../../Components/Forms/ScheduleFormPreview";
import TeamFormPreview from "../../Components/Forms/TeamFormPreview";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedButton } from "../../utils/ThemedComponents";
import "../../Components/Forms/Forms.css";
import { useNavigate } from "react-router-dom";

function CompletedForm() {
  const [{ theme, formData }, dispatch] = useStateValue();
  const [mouseOver, setMouseOver] = useState(false);

  const [admin, setAdmin] = useState(null);

  const [team, setTeam] = useState();

  const [players, setPlayers] = useState();

  const [coaches, setCoaches] = useState();

  const [schedule, setSchedule] = useState();
  const navigate = useNavigate();

  const handleMouseOver = () => {};

  const handleMouseOut = () => {};

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: "SET_FORM_DATA",
      formData: { admin, team, players, coaches, schedule },
    });
    localStorage.clear();
    // navigate("/");
  };

  useEffect(() => {
    const getLocalData = () => {
      const localAdminData = localStorage.getItem("admin data");
      const localTeamData = localStorage.getItem("team data");
      const localPlayersData = localStorage.getItem("players data");
      const localCoachesData = localStorage.getItem("coaches data");
      const localScheduleData = localStorage.getItem("schedule data");
      if (localAdminData) {
        setAdmin(JSON.parse(localAdminData));
      }
      if (localTeamData) {
        setTeam(JSON.parse(localTeamData));
      }
      if (localPlayersData) {
        setPlayers(JSON.parse(localPlayersData));
      }
      if (localCoachesData) {
        setCoaches(JSON.parse(localCoachesData));
      }
      if (localScheduleData) {
        setSchedule(JSON.parse(localScheduleData));
      }
    };

    getLocalData();

    window.addEventListener("localData", getLocalData);
    return () => {
      window.removeEventListener("localData", getLocalData);
    };
  }, []);
  return (
    <div className="completedForm form">
      {formData && <h3>Data successfully submitted</h3>}
      {admin ? (
        <AdminFormPreview adminData={admin} />
      ) : formData ? (
        <AdminFormPreview adminData={formData.admin} />
      ) : (
        <AdminFormPreview />
      )}
      {team ? (
        <TeamFormPreview teamData={team} />
      ) : formData ? (
        <TeamFormPreview adminData={formData.team} />
      ) : (
        <TeamFormPreview />
      )}
      {players ? (
        <PlayersFormPreview playersData={players} />
      ) : formData ? (
        <PlayersFormPreview playersData={formData.players} />
      ) : (
        <PlayersFormPreview />
      )}
      {coaches ? (
        <CoachesFormPreview coachesData={coaches} />
      ) : formData ? (
        <CoachesFormPreview coachesData={formData.coaches} />
      ) : (
        <CoachesFormPreview />
      )}
      {schedule ? (
        <ScheduleFormPreview scheduleData={schedule} />
      ) : formData ? (
        <ScheduleFormPreview scheduleData={formData.schedule} />
      ) : (
        <ScheduleFormPreview />
      )}

      <div className="formContainer formPreview__btns">
        <ThemedButton
          theme={theme}
          hovering={mouseOver}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={handleSubmit}
        >
          Submit All Data
        </ThemedButton>
      </div>
    </div>
  );
}

export default CompletedForm;
