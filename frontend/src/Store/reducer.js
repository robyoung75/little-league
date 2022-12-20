import themes from "../api/theme";
import data from "../api/data";
import users from "../api/users";

// console.log(data);

export const initialState = {
  authUser: null,
  authTeam: null,
  authPlayers: null,
  authCoaches: null,
  authSchedule: null,
  authPosts: null,
  authTheme:  {
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
  userData: users[0],
  teamData: data[0],
  player: null,
  theme: themes[0],
  posts: null,
  gameData: null,
  formData: null,
  errors: null,
};

// reducer takes in a state and and action updating the entire app
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_AUTH_USER":
      return {
        ...state,
        authUser: action.authUser,
      };

    case "SET_AUTH_TEAM":
      return {
        ...state,
        authTeam: action.authTeam,
      };

    case "SET_AUTH_PLAYERS":
      return {
        ...state,
        authPlayers: action.authPlayers,
      };
    case "SET_AUTH_COACHES":
      return {
        ...state,
        authCoaches: action.authCoaches,
      };

    case "SET_AUTH_SCHEDULE":
      return {
        ...state,
        authSchedule: action.authSchedule,
      };

    case "SET_AUTH_POSTS":
      return {
        ...state,
        authPosts: action.authPosts,
      };

    case "SET_AUTH_THEME":
      return {
        ...state,
        authTheme: action.authTheme,
      };
    case "SET_USER":
      return {
        ...state,
        userData: action.userData,
      };

    case "SET_TEAM":
      return {
        ...state,
        teamData: action.teamData,
      };

    case "SET_POSTS":
      return {
        ...state,
        posts: action.posts,
      };

    case "SET_PLAYER":
      let authPlayer = state.player;

      if (state.userData !== null && state.teamData !== null) {
        state.teamData.players.forEach((player) => {
          if (player.firstName === state.userData.firstName) {
            authPlayer = player;
          }
        });
        return {
          ...state,
          player: authPlayer,
        };
      } else {
        return {
          ...state,
          player: initialState,
        };
      }

    case "SET_THEME":
      let userTheme = state.theme;

      if (state.userData !== null) {
        themes.map((theme) => {
          if (theme.id === state.userData.teamId) {
            userTheme = theme;
          }
          return "";
        });
        return {
          ...state,
          theme: userTheme,
        };
      } else {
        return {
          ...state,
          theme: themes[0],
        };
      }

    case "SET_GAME_DATA":
      return {
        ...state,
        gameData: action.gameData,
      };

    case "SET_FORM_DATA":
      return {
        ...state,
        formData: action.formData,
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors,
      };

    default:
      return state;
  }
};

export default reducer;
