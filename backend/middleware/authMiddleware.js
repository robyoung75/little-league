// import verifyJwtToke from ../controllers/createJWT.js
import { verifyJwtToken } from "../controllers/createJWT.js";

const requiresAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check if token exists
  if (token) {
    let auth = verifyJwtToken(token, process.env.TOKEN_SECRET);
    console.log("middleware auth", auth);
    req.userId = auth;
    next();
  } else {
    let error = new Error("you must be signed in and authorized to proceed");
    req.error = error;
    next();
  }
};

// params middleware to find teamid
const getTeamByTeamId = (req, res, next, teamId) => {
  req.userTeamId = teamId;
  next();
};

// params middleware to find player id
const getPlayerById = (req, res, next, playerId) => {
  req.userPlayerId = playerId;
  next();
};

export { requiresAuth, getTeamByTeamId, getPlayerById };
