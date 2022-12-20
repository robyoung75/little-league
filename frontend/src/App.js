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
  authUserSignOut,
} from "./assets/requests";

const user_1 = "byoung@gmail.com";

const user_2 = "rykerk@gmail.com";

function App() {
  const [
    {
      theme,
      player,
      userData,
      teamData,
      posts,
      gameData,
      formData,
      authUser,
      authTeam,
      authPlayers,
      authCoaches,
      authSchedule,
      authPosts,
    },
    dispatch,
  ] = useStateValue();
  const [authenticated, setAuthenticated] = useState(false);
  const [auth, setAuth] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [isActive, setActive] = useState(false);
  const [userTeam, setUserTeam] = useState(null);
  const [mobile] = useState(768);

  // useEffect keeps my user state even during a page refresh.
  // local storage is cleared on sign out
  useEffect(async () => {
    if (localStorage.getItem("user") && !authUser) {
      dispatch({
        type: "SET_AUTH_USER",
        authUser: JSON.parse(localStorage.getItem("user")),
      });
      setAuthenticated(true);
      setSignedIn(true);
    }
  }, [authenticated, authUser]);

  // useEffect to fetch teams data
  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      const teamData = await authUserGetTeam(authUser.teamId);
      const playersData = await authUserGetPlayers(authUser.teamId);
      const coachesData = await authUserGetCoaches(authUser.teamId);
      const scheduleData = await authUserGetSchedule(authUser.teamId);
      const postsData = await authUserGetPosts(authUser.teamId);

      dispatch({
        type: "SET_AUTH_TEAM",
        authTeam: teamData.data,
      });

      dispatch({
        type: "SET_AUTH_PLAYERS",
        authPlayers: playersData.data,
      });

      dispatch({
        type: "SET_AUTH_COACHES",
        authCoaches: coachesData.data,
      });

      dispatch({
        type: "SET_AUTH_SCHEDULE",
        authSchedule: scheduleData.data,
      });

      dispatch({
        type: "SET_AUTH_POSTS",
        authPosts: postsData.data,
      });

      dispatch({
        type: "SET_AUTH_THEME",
        authTheme: {
          name: teamData.data.teamName,
          id: teamData.data.teamId,
          style: {
            background: teamData.data.primaryColor,
            color: teamData.data.secondaryColor,
          },
          primaryColor: {
            color: teamData.data.primaryColor,
          },
          secondaryColor: {
            color: teamData.data.secondaryColor,
          },
          tertiaryColor: {
            color: "#a1aaad",
          },
          btn: {
            background: teamData.data.primaryColor,
            color: "#a1aaad",
            // background: "linear-gradient(to right, #bd3039  50%, #a1aaad 50%) right",
            // backgroundSize: "300%",
            // backgroundPosition: "left",
          },
          btn__hover: {
            background: "#a1aaad",
            // background: "linear-gradient(to right, #bd3039  50%, #a1aaad 50%) right",
            // backgroundPosition: "right",
            // backgroundSize: "200%",
            color: teamData.data.primaryColor,
          },
        },
      });
    };

    if (authenticated && authUser && isSubscribed) {
      fetchData().catch(console.error);
    } else {
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

      dispatch({
        type: "SET_AUTH_THEME",
        authTheme: {
          name: "razorBacks",
          id: "111112",
          style: {
            background: "#BD3039",
            color: "#C4CED4",
          },
          primaryColor: {
            color: "#BD3039",
          },
          secondaryColor: {
            color: "#C4CED4",
          },
          tertiaryColor: {
            color: "#a1aaad",
          },
          btn: {
            background: "#BD3039",
            color: "#a1aaad",
          },
          btn__hover: {
            background: "#a1aaad",
            color: "#bd3039",
          },
        },
      });
    }

    return () => {
      isSubscribed = false;
    };
  }, [authenticated, authUser]);



  // useEffect(() => {
  //   //  simulate the request from database for user validation
  //   const user = (userEmail) => {
  //     let signedIn;
  //     users.forEach((item) => {
  //       if (item.email === userEmail) {
  //         signedIn = item;
  //         // setSignedIn(true);
  //       }
  //     });
  //     return signedIn;
  //   };
  //   setAuth(user(userData.email));
  // }, []);

  // useEffect(() => {
  //   if (auth) {
  //     //  simulate the request from database for team data
  //     const setTeam = (data) => {
  //       data.forEach((item) => {
  //         if (item.teamId === auth.teamId) {
  //           data = item;
  //         }
  //       });
  //       return data;
  //     };
  //     setUserTeam(setTeam(data));
  //   }
  // }, [auth]);

  // useEffect(() => {
  //   if (auth && userTeam) {
  //     dispatch({
  //       type: "SET_USER",
  //       userData: auth,
  //     });
  //     dispatch({
  //       type: "SET_THEME",
  //       theme: theme,
  //     });
  //     dispatch({
  //       type: "SET_TEAM",
  //       teamData: userTeam,
  //     });
  //     dispatch({
  //       type: "SET_PLAYER",
  //       player: player,
  //     });
  //   }
  // }, [auth, userTeam, dispatch, theme, player]);

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
              authenticated={authenticated}
              setAuthenticated={setAuthenticated}
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
            element={
              <UserSignIn
                setSignedIn={setSignedIn}
                setAuthenticated={setAuthenticated}
              />
            }
          />
          <Route path="/forms" element={<SideNavbar />}>
            <Route
              path="create_admin"
              element={
                <AdminSignUp
                  setSignedIn={setSignedIn}
                  setAuthenticated={setAuthenticated}
                />
              }
            />
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
