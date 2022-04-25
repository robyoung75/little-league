import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "./SideNavbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { ThemedDiv } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";

function SideNavbar() {
  const [active, setActive] = useState(false);
  const [{ theme }] = useStateValue();

  const handleActive = () => {
    active === true ? setActive(false) : setActive(true);
  };

  return (
    <div className="sideNavbar">
      <ThemedDiv
        theme={theme}
        className={active ? "sideNavbar__active" : "sideNavbar__notActive"}
      >
        <div className="sideNavbar__iconClose">
          <FontAwesomeIcon icon={faX} onClick={handleActive} />
        </div>
        <div className="sideNavbar__content">
          <h3>Forms</h3>
          <p onClick={handleActive}>
            <Link className="sideNavbar__link" to="/forms/create_admin">
              Admin
            </Link>
          </p>
          <p onClick={handleActive}>
            <Link className="sideNavbar__link" to="/forms/create_teamName">
              Team
            </Link>
          </p>
          <p onClick={handleActive}>
            <Link className="sideNavbar__link" to="/forms/create_players">
              Players
            </Link>
          </p>
          <p onClick={handleActive}>
            <Link className="sideNavbar__link" to="/forms/create_coaches">
              Coaches
            </Link>
          </p>
          <p onClick={handleActive}>
            <Link className="sideNavbar__link" to="/forms/create_schedule">
              Schedule
            </Link>
          </p>
          <p onClick={handleActive}>
            <Link className="sideNavbar__link" to="/forms/completed_form">
              Data Review
            </Link>
          </p>
        </div>
      </ThemedDiv>
      {!active && (
        <div className="sideNavbar__icon">
          <FontAwesomeIcon icon={faBars} onClick={handleActive} />
        </div>
      )}

      <Outlet />
    </div>
  );
}

export default SideNavbar;
