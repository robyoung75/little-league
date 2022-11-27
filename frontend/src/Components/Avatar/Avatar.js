import React from "react";
import { useStateValue } from "../../Context/stateProvider";
import "./Avatar.css";

function Avatar() {
  const [{ userData }] = useStateValue();
  return (
    <>
      {userData ? (
        <div className="avatar">
          {/* {userData && userData.image ? (
            <img src={userData.image} alt="player" className="avatar__img" />
          ) : userData && !userData.image ? (
            userData.firstName.slice(0, 1).toUpperCase() +
            userData.lastName.slice(0, 1).toUpperCase()
          ) : null} */}

          {userData ? <div className="avatar__badge"></div> : null}
        </div>
      ) : null}
    </>
  );
}

export default Avatar;
