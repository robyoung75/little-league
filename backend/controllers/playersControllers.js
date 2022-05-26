// import model schemas from models/teamControllers
import TeamSchema from "../models/team.js";
import AdminUserSchema from "../models/aminUser.js";
import TeamPlayersSchema from "../models/teamPlayers.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import { async_cloudinaryStreamImg } from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";
import { findUserById } from "../utilities/controllerFunctions.js";

// create team players
export const authPlayers_post = async (req, res) => {
  console.log({ authPlayers_post_req_body: req.body });

  try {
    // req.userId returns from auth
    const { id } = req.userId;

    const authUserDoc = await AdminUserSchema.findById(id);

    if (authUserDoc) {
      console.log({ authPlayers_post_authUserDoc: authUserDoc });

      // create a teamId that matches authUser id for reference
      // add the teamId to each object
      req.body.forEach((object) => (object.teamId = authUserDoc._id));
      const adminPlayerPost = req.body;
      console.log({ authPlayers_post_adminPlayerPost: adminPlayerPost });

      // create new team players post
      const authPlayerDoc = await TeamPlayersSchema.create({
        teamId: authUserDoc._id,
        teamUserName: authUserDoc.teamUserName,
        teamName: authUserDoc.teamName,
        players: adminPlayerPost,
      });

      const response = {
        teamId: authPlayerDoc.teamId,
        teamName: authPlayerDoc.teamName,
        teamUserName: authPlayerDoc.teamUserName,
        players: authPlayerDoc.players,
      };
      res.status(200).json(response);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
