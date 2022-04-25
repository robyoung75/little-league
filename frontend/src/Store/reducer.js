import themes from "../api/theme";
import data from '../api/data'
import users from "../api/users";


// console.log(data);

export const initialState = {
  userData: users[0],
  teamData: data[0],
  player: null,
  theme: themes[0],
  posts: null,
  gameData: null,
  formData: null,
};

// reducer takes in a state and and action updating the entire app
const reducer = (state, action) => {
  switch (action.type) {
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
          formData: action.formData
        }

    default:
      return state;
  }
};

export default reducer;
