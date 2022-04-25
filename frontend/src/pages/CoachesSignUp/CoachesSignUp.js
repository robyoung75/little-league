import React, { useState, useEffect } from "react";
import './CoachesSignUp.css'
import CoachesForm from "../../Components/Forms/CoachesForm";
import CoachesFormPreview from "../../Components/Forms/CoachesFormPreview";
import { checkLocalData } from "../../assets/functions";

function CoachesSignUp() {
  const [coachesData, setCoachesData] = useState();
  const [newCoachesData, setNewCoachesData] = useState(false);

  useEffect(() => {
    checkLocalData("coaches data", setCoachesData);

    window.addEventListener("localCoaches", checkLocalData);
    return () => {
      window.removeEventListener("localCoaches", checkLocalData);
    };
  }, [newCoachesData]);

  return (
    <div className="coachesSignUp">
      <div className="coachesSignUp__left">
        <CoachesForm
          newCoachesData={newCoachesData}
          setNewCoachesData={setNewCoachesData}
        />
      </div>
      <div className="coachesSignUp__right">
        <CoachesFormPreview
          coachesData={coachesData}
          setCoachesData={setCoachesData}
        />
      </div>
    </div>
  );
}

export default CoachesSignUp;
