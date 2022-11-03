// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// cloudinary functions
import { async_cloudinaryDeleteImg } from "../utilities/cloudinaryFuctions.js";

// controller functions
import {
  getTeamById,
  updateTeamColors,
  handleSingleImageUpload,
} from "../utilities/controllerFunctions.js";

// CONTROLLERS FOR ADMIN TO CREATE A TEAM
// create team, set team colors and logo image

const createTeam_post = async (req, res) => {
  try {
    if (req.error) {
      console.log({ authTeam_post: req.error });
      throw req.error;
    }

    // req.userId returns from auth middleware
    const { id } = req.userId;

    let { primaryColor, secondaryColor, teamUserName, teamName } = req.body;

    let teamUpdate = {
      logoUpdate: "",
      colorUpdate: "",
    };

    let imgUpData = {
      id,
      teamUserName,
      teamName,
      imgFile: req.file,
      imgTagName: "teamLogo",
    };

    // handle image and upload to cloudinary and publicId and url to mongodb
    teamUpdate.logoUpdate = await handleSingleImageUpload(imgUpData);

    // handle team colors and send to mongodb
    teamUpdate.colorUpdate = await updateTeamColors(id, {
      primaryColor,
      secondaryColor,
    });

    res.status(200).json(teamUpdate);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// READ TEAM
const team_get = async (req, res) => {
  try {
    const team = await getTeamById(req.userTeamId);
    res.status(200).json(team);
  } catch (error) {
    console.log({ team_get: error });
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// UPDATE TEAM LOGO and COLORS
const teamUdpdate_put = async (req, res) => {
  try {
    if (req.error) {
      console.log({ authTeam_post: req.error });
      throw req.error;
    }

    // req.userId returns from auth middleware
    const { id } = req.userId;
    const { teamLogoPublicId } = req.query;
    let { primaryColor, secondaryColor, teamUserName, teamName } = req.body;

    // variables
    let teamUpdate = {
      logoUpdate: "",
      colorUpdate: "",
    };

    let imgUpData = {
      id,
      teamUserName,
      teamName,
      imgFile: req.file,
      imgTagName: "teamLogo",
    };

    // delete existing cloudinary image, add new image
    if (req.file) {
      // delete existing image from cloudinary
      const result = await async_cloudinaryDeleteImg(teamLogoPublicId);
      console.log("teamUpdate_put_result", result);

      // handle image and upload to cloudinary and publicId and url to mongodb
      teamUpdate.logoUpdate = await handleSingleImageUpload(imgUpData);
    }

    if (primaryColor && secondaryColor) {
      teamUpdate.colorUpdate = await updateTeamColors(id, {
        primaryColor,
        secondaryColor,
      });
    }

    res.status(200).json(teamUpdate);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

export { createTeam_post, team_get, teamUdpdate_put };
