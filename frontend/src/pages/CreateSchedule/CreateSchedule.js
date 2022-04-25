import React, { useState, useEffect } from "react";
import "./CreateSchedule.css";
import ScheduleForm from "../../Components/Forms/ScheduleForm";
import ScheduleFormPreview from "../../Components/Forms/ScheduleFormPreview";
import { checkLocalData } from "../../assets/functions";
function CreateSchedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const [newScheduleData, setNewScheduleData] = useState(false);

  useEffect(() => {
    checkLocalData("schedule data", setScheduleData);

    window.addEventListener("localSchedule", checkLocalData);
    return () => {
      window.removeEventListener("localSchedule", checkLocalData);
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
