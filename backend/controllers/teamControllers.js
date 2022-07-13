// import model schemas from models/teamControllers
import TeamSchema from "../models/team.js";
import AdminUserSchema from "../models/teamAdmin.js";
import TeamPlayersSchema from "../models/teamPlayers.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import { async_cloudinaryStreamImg } from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";
import {
  findAdminUserById,
  createNewTeam,
  findTeamById,
} from "../utilities/controllerFunctions.js";

// CONTROLLERS FOR ADMIN TO CREATE A TEAM
// create team
const authTeam_post = async (req, res) => {
  try {
    if (req.error) {
      console.log({ authTeam_post: req.error });
      throw req.error;
    }

    // req.userId returns from auth middleware
    const { id } = req.userId;
    const adminUser = await findAdminUserById(id);
    const existingTeam = await findTeamById(adminUser.teamId);
    req.body.teamLogo = null;
    let { primaryColor, secondaryColor, teamLogo } = req.body;

    if (req.file) {
      // sharp to reduce image size for db storage
      teamLogo = await sharpImgResize(req.file);
    }

    if (adminUser && existingTeam) {
      throw Error("A team with this id already exists");
    }

    if (adminUser && !existingTeam) {
      // cloudinary upload image returning a result
      const imgUploadResponse = await async_cloudinaryStreamImg(
        teamLogo,
        adminUser.teamId,
        adminUser.teamUserName
      );
      // console.log("imgUploadResponse >>>>> ", imgUploadResponse);

      const authTeamDoc = await createNewTeam({
        teamName: adminUser.teamName,
        teamUserName: adminUser.teamUserName,
        teamId: adminUser.teamId,
        primaryColor,
        secondaryColor,
        teamLogo: imgUploadResponse ? imgUploadResponse.secure_url : null,
      });

      res.status(200).json(authTeamDoc);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

export { authTeam_post };
