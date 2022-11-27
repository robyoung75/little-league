import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useStateValue } from "./Context/stateProvider";
import Navbar from "./Components/Navbar/Navbar";
import Social from "./pages/Social/Social";
import Home from "./pages/Home/Home";
import Roster from "./pages/Roster/Roster";
import Schedule from "./pages/Schedule/Schedule";

import data from "./api/data";
import users from "./api/users";
import TeamSignUpForm from "./pages/TeamSignUpForm/TeamSignUpForm";
import AdminSignUp from "./pages/AdminSignUp/AdminSignUp";
import TeamSignUp from "./pages/TeamSignUp/TeamSignUp";
import PlayersSignUp from "./pages/PlayersSignUp/PlayersSignUp";
import CoachesSignUp from "./pages/CoachesSignUp/CoachesSignUp";
import CreateSchedule from "./pages/CreateSchedule/CreateSchedule";
import CompletedForm from "./pages/CompletedForm/CompletedForm";
import SideNavbar from "./Components/SideNavbar/SideNavbar";
import Footer from "./Components/Footer/Footer";
import UserSignIn from "./pages/UserSignIn/UserSignIn";
import {
  authUserGetCoaches,
  authUserGetPlayers,
  authUserGetPosts,
  authUserGetSchedule,
  authUserGetTeam,
} from "./assets/requests";

const user_1 = "byoung@gmail.com";

const user_2 = "rykerk@gmail.com";

function App() {
  const [
    { theme, player, userData, teamData, posts, gameData, formData, authUser },
    dispatch,
  ] = useStateValue();
  const [auth, setAuth] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [isActive, setActive] = useState(false);
  const [userTeam, setUserTeam] = useState(null);
  const [mobile] = useState(768);

  useEffect(() => {

      if (localStorage.getItem("user") && !authUser) {

        dispatch({
          type: "SET_AUTH_USER",
          authUser: JSON.parse(localStorage.getItem("user")),
        });

      }
   
 
  
  }, [authUser, signedIn]);

  useEffect(async () => {
    if (authUser) {
      const team = await authUserGetTeam(authUser.teamId);
      const players = await authUserGetPlayers(authUser.teamId);
      const coaches = await authUserGetCoaches(authUser.teamId);
      const schedule = await authUserGetSchedule(authUser.teamId);
      const posts = await authUserGetPosts(authUser.teamId);

      dispatch({
        type: "SET_AUTH_TEAM",
        authTeam: team.data,
      });

      dispatch({
        type: "SET_AUTH_PLAYERS",
        authPlayers: players.data,
      });

      dispatch({
        type: "SET_AUTH_COACHES",
        authCoaches: coaches.data,
      });

      dispatch({
        type: "SET_AUTH_SCHEDULE",
        authSchedule: schedule.data,
      });

      dispatch({
        type: "SET_AUTH_POSTS",
        authPosts: posts.data,
      });
    }
  }, [localStorage.getItem("user")]);

  useEffect(() => {
    //  simulate the request from database for user validation
    const user = (userEmail) => {
      let signedIn;
      users.forEach((item) => {
        if (item.email === userEmail) {
          signedIn = item;
          setSignedIn(true);
        }
      });
      return signedIn;
    };
    setAuth(user(userData.email));
  }, []);

  useEffect(() => {
    if (auth) {
      //  simulate the request from database for team data
      const setTeam = (data) => {
        data.forEach((item) => {
          if (item.teamId === auth.teamId) {
            data = item;
          }
        });
        return data;
      };
      setUserTeam(setTeam(data));
    }
  }, [auth]);

  useEffect(() => {
    if (auth && userTeam) {
      dispatch({
        type: "SET_USER",
        userData: auth,
      });
      dispatch({
        type: "SET_THEME",
        theme: theme,
      });
      dispatch({
        type: "SET_TEAM",
        teamData: userTeam,
      });
      dispatch({
        type: "SET_PLAYER",
        player: player,
      });
    }
  }, [auth, userTeam, dispatch, theme, player]);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <Navbar
              isActive={isActive}
              setActive={setActive}
              mobile={mobile}
              signedIn={signedIn}
              setSignedIn={setSignedIn}
            />
          }
        >
          <Route index element={<Home isActive={isActive} />} />
          <Route
            path="social"
            element={
              <Social
                isActive={isActive}
                setActive={setActive}
                mobile={mobile}
              />
            }
          />

          <Route path="/roster" element={<Roster isActive={isActive} />} />
          <Route
            path="/schedule"
            element={<Schedule mobile={mobile} isActive={isActive} />}
          />
          <Route path="/create_team" element={<TeamSignUpForm />} />
          <Route
            path="user_signIn"
            element={<UserSignIn setSignedIn={setSignedIn} />}
          />
          <Route path="/forms" element={<SideNavbar />}>
            <Route path="create_admin" element={<AdminSignUp />} />
            <Route path="create_teamName" element={<TeamSignUp />} />
            <Route path="create_players" element={<PlayersSignUp />} />
            <Route path="create_coaches" element={<CoachesSignUp />} />
            <Route path="create_schedule" element={<CreateSchedule />} />
            <Route path="completed_form" element={<CompletedForm />} />
          </Route>
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
