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

// CONTROLLERS FOR ADMIN TO CREATE A TEAM
// create team
const authTeam_post = async (req, res) => {
  console.log("authTeam_post controller.js >>>>> req.file", req.file);
  console.log("authTeam_post controller.js >>>>> req.body", req.body);
  try {
    // req body
    const { primaryColor, secondaryColor } = req.body;

    let authUser = {
      authStatus: false,
      authId: null,
      authUserDoc: null,
    };

    if (req.error) {
      console.log({ authTeam_post: req.error });
      throw req.error;
    } else {
      // req.userId returns from auth middleware
      let { id } = req.userId;
      authUser.authId = id;
      authUser.authStatus = true;
      authUser.authUserDoc = await AdminUserSchema.findById(authUser.authId)
    }

    if (authUser.authStatus && req.file && authUser.authUserDoc) {
      // sharp to reduce image size for db storage
      const reducedFileSize = await sharpImgResize(req.file);

      // cloudinary upload image returning a result
      const imgUploadResponse = await async_cloudinaryStreamImg(
        reducedFileSize,
        authUser.authId,
        authUser.authUserDoc.teamUserName
      );
      // console.log("imgUploadResponse >>>>> ", imgUploadResponse);

      const authTeamDoc = await TeamSchema.create({
        teamName: authUser.authUserDoc.teamName,
        teamId: authUser.authUserDoc._id,
        primaryColor,
        secondaryColor,
        teamLogo: imgUploadResponse.secure_url,
      });

      res.status(200).json({
        teamName: authTeamDoc.teamName,
        teamId: authTeamDoc._id,
        primaryColor: authTeamDoc.primaryColor,
        secondaryColor: authTeamDoc.secondaryColor,
        teamLogo: authTeamDoc.teamLogo,
      });
    }

    if (authUser.authStatus && authUser.authUserDoc && !req.file) {
      const authTeamDoc = await TeamSchema.create({
        teamName: authUser.authUserDoc.teamName,
        teamId: authUser.authUserDoc._id,
        primaryColor,
        secondaryColor,
        teamLogo: "none",
      });

      res.status(200).json({
        teamName: authTeamDoc.teamName,
        teamId: authTeamDoc._id,
        primaryColor: authTeamDoc.primaryColor,
        secondaryColor: authTeamDoc.secondaryColor,
        teamLogo: authTeamDoc.teamLogo,
      });
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// create team players
const authPlayers_post = async (req, res) => {
  try {
    // req.userId returns from auth
    const { id } = req.userId;

    const authUserDoc = await AdminUserSchema.findById(id);

    if (authUserDoc) {
      // create a teamId that matches authUser id for reference
      req.body.teamId = req.userId.id;
      req.body.teamName = authUserDoc.teamName;
      req.body.teamUserName = authUserDoc.teamUserName;
      // add the teamId to each object
      req.body.players.forEach((object) => (object.teamId = authUserDoc._id));
      const adminPlayerPost = req.body;

      // create new team players post
      const authPlayerDoc = await TeamPlayersSchema.create(adminPlayerPost);
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

export { authTeam_post, authPlayers_post };
