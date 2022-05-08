// import model schemas from models/teamControllers
import TeamSchema from "../models/team.js";
import AdminUserSchema from "../models/aminUser.js";
import TeamPlayersSchema from "../models/teamPlayers.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// import jsonwebtoken functions from createJWT.js
import { createJwtToken, maxAge } from "./createJWT.js";
import user from "../models/aminUser.js";

// CONTROLLERS FOR ADMIN TO CREATE A TEAM

// create team
const authTeam_post = async (req, res) => {
  // req body
  const { primaryColor, secondaryColor } = req.body;
  // req.userId returns from auth middleware
  console.log("authTeam_post req.userId from middleware", req.userId);
  const { id } = req.userId;
  console.log("team post id", id);

  try {
    const authUserDoc = await AdminUserSchema.findById(id);
    console.log("autUserDoc from team post", authUserDoc);

    if (authUserDoc) {
      const adminTeamPost = {
        teamName: authUserDoc.teamName,
        teamId: authUserDoc._id,
        primaryColor,
        secondaryColor,
      };
      const authTeamDoc = await TeamSchema.create(adminTeamPost);

      const response = {
        teamName: authTeamDoc.teamName,
        teamId: authTeamDoc._id,
        primaryColor: authTeamDoc.primaryColor,
        secondaryColor: authTeamDoc.secondaryColor,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

const authPlayers_post = async (req, res) => {
  // req body
  console.log(req.body);
  // req.userId returns from auth middleware
  console.log("authTeam_post req.userId from middleware", req.userId);
  const { id } = req.userId;
  console.log("team post id", id);

  try {
    const authUserDoc = await AdminUserSchema.findById(id);
    console.log("autUserDoc from team post", authUserDoc);

    if (authUserDoc) {
      // create a teamId that matches authUser id for reference
      req.body.teamId = req.userId.id;
      // add the teamId to each object
      req.body.forEach((object) => (object.teamId = authUserDoc._id));
      const adminPlayerPost = { players: req.body, teamId: authUserDoc._id };

      console.log(adminPlayerPost);
      // create new team players post
      const authPlayerDoc = await TeamPlayersSchema.create(adminPlayerPost);
      const response = {
        players: authPlayerDoc.players,
        teamId: authUserDoc._id,
      };
      res.status(200).json(response);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

export { authTeam_post, authPlayers_post };
