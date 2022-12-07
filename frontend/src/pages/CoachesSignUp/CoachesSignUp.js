import React, { useState, useEffect } from "react";
import './CoachesSignUp.css'
import CoachesForm from "../../Components/Forms/CoachesForm";
import CoachesFormPreview from "../../Components/Forms/CoachesFormPreview";
import { checkLocalData } from "../../assets/functions";
import { authUserGetCoaches } from "../../assets/requests";
import { useStateValue } from "../../Context/stateProvider";

function CoachesSignUp() {
  const [coachesData, setCoachesData] = useState();
  const [newCoachesData, setNewCoachesData] = useState(false);

  const [{authUser}, dispatch] = useStateValue()

  useEffect(() => {
    checkLocalData("coachesData", setCoachesData);

    window.addEventListener("localCoaches", checkLocalData);
    return () => {
      window.removeEventListener("localCoaches", checkLocalData);
    };
  }, [newCoachesData]);

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      const coachesData = await authUserGetCoaches(authUser.teamId)

      dispatch({
        type: "SET_AUTH_COACHES",
        authCoaches: coachesData.data,
      });
    };

    if (isSubscribed && authUser) {
      fetchData().catch(console.error);
    }

    return () => {
      isSubscribed = false;
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
