import React, { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedDiv } from "../../utils/ThemedComponents";
import "./Navbar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";

import { authUserSignOut } from "../../assets/requests";

import { useNavigate } from "react-router-dom";

function Navbar({
  isActive,
  setActive,
  mobile,
  signedIn,
  setSignedIn,
  authenticated,
  setAuthenticated,
}) {
  const [{ theme, teamData, userData, authUser }, dispatch] = useStateValue();
  const navigate = useNavigate();

  // dropdown event handler
  const handleDropdown = (e) => {
    e.preventDefault();
    console.log("handleDropdown");
    if (isActive === false) {
      setActive(true);
      window.scrollTo(0, 0);
    }
    if (isActive === true) {
      setActive(false);
    }
  };

  const handleCloseMobileNav = (e) => {
    if (isActive === true) {
      setActive(false);
    }
  };

  const handleUserAuthentication = (e) => {
    e.preventDefault();

    if (localStorage.getItem("user")) {
      setSignedIn(false);
      setAuthenticated(false);
      localStorage.clear("user");

      dispatch({
        type: "SET_AUTH_USER",
        authUser: null,
      });

      dispatch({
        type: "SET_AUTH_TEAM",
        authTeam: null,
      });

      dispatch({
        type: "SET_AUTH_PLAYERS",
        authPlayers: null,
      });

      dispatch({
        type: "SET_AUTH_COACHES",
        authCoaches: null,
      });

      dispatch({
        type: "SET_AUTH_SCHEDULE",
        authSchedule: null,
      });

      dispatch({
        type: "SET_AUTH_POSTS",
        authPosts: null,
      });
    }
  };

  useEffect(() => {
    let handleResize = () => {
      if (window.innerWidth >= mobile && isActive === true) setActive(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive, mobile, setActive]);

  return (
    <div className="navbar">
      <ThemedDiv
        className={isActive ? "navbar__dropdownActive" : "navbar__dropdown"}
        theme={theme}
      >
        <ul className="navbar__list">
          <div className="navbar__listRight">
            <li className="navbar__listItem" onClick={handleCloseMobileNav}>
              <Link className="navbar__listLink" to="/" style={theme.style}>
                Home
              </Link>
            </li>
            <li className="navbar__listItem" onClick={handleCloseMobileNav}>
              <Link
                className="navbar__listLink"
                to="/social"
                style={theme.style}
              >
                Social
              </Link>
            </li>
            <li className="navbar__listItem" onClick={handleCloseMobileNav}>
              <Link
                className="navbar__listLink"
                to="roster"
                style={theme.style}
              >
                Roster
              </Link>
            </li>
          </div>

          <div className="navbar__listLeft">
            <li className="navbar__listItem" onClick={handleCloseMobileNav}>
              <Link
                className="navbar__listLink"
                to="schedule"
                style={theme.style}
              >
                Schedule
              </Link>
            </li>
            <li className="navbar__listItem" onClick={handleCloseMobileNav}>
              <Link
                className="navbar__listLink"
                to="user_signIn"
                style={theme.style}
              >
                {signedIn === true ? (
                  <span onClick={handleUserAuthentication}>Sign out</span>
                ) : (
                  <span>Sign in</span>
                )}
              </Link>
            </li>
          </div>
        </ul>
      </ThemedDiv>

      <ThemedDiv className="navbar__header" theme={theme}></ThemedDiv>
      <div className="navbar__imageContainer">
        <img
          className="navbar__listItemImage"
          src={teamData ? teamData.logo : null}
          alt="team logo"
        />
      </div>
      <ThemedDiv className="navbar__hamburger" theme={theme}>
        {isActive ? (
          <FontAwesomeIcon icon={faX} onClick={handleDropdown} />
        ) : (
          <FontAwesomeIcon icon={faBars} onClick={handleDropdown} />
        )}
      </ThemedDiv>
      <Outlet />
    </div>
  );
}

export default Navbar;
