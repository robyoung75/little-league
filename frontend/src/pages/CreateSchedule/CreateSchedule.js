import React, { useState, useEffect } from "react";
import "./CreateSchedule.css";
import ScheduleForm from "../../Components/Forms/ScheduleForm";
import ScheduleFormPreview from "../../Components/Forms/ScheduleFormPreview";
import { checkLocalData } from "../../assets/functions";
import { useStateValue } from "../../Context/stateProvider";
import { authUserGetSchedule } from "../../assets/requests";
function CreateSchedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const [newScheduleData, setNewScheduleData] = useState(false);
  const [{authUser}, dispatch] = useStateValue()

  useEffect(() => {
    checkLocalData("scheduleData", setScheduleData);

    window.addEventListener("localSchedule", checkLocalData);
    return () => {
      window.removeEventListener("localSchedule", checkLocalData);
    };
  }, [newScheduleData]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      const scheduleData = await authUserGetSchedule(authUser.teamId)

      dispatch({
        type: "SET_AUTH_SCHEDULE",
        authSchedule: scheduleData.data,
      });
    };

    if (isSubscribed && authUser) {
      fetchData().catch(console.error);
    }

    return () => {
      isSubscribed = false;
    };
  }, [newScheduleData]);


  return (
    <div className="createSchedule">
      <div className="createSchedule__left">
        <ScheduleForm
          newScheduleData={newScheduleData}
          setNewScheduleData={setNewScheduleData}
        />
      </div>
      <div className="createSchedule__right">
        <ScheduleFormPreview
          scheduleData={scheduleData}
          setScheduleData={setScheduleData}
        />
      </div>
    </div>
  );
}

export default CreateSchedule;
