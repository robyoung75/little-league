// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// cloudinary functions
import { async_cloudinaryDeleteImg } from "../utilities/cloudinaryFuctions.js";

// controller functions
import {
  getTeamById,
  updateTeamColors,
  handleSingleImageUpload,
  updateTeamLogo,
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
    console.log({
      createTeam_post_reqBody_____: {
        primaryColor,
        secondaryColor,
        teamUserName,
        teamName,
      },
    });

    // upload object for cloudinary
    let imgUpData = {
      id,
      teamUserName,
      teamName,
      imgFile: req.file,
      imgTagName: "teamLogo",
    };

    // handle image and upload to cloudinary and publicId and url to mongodb
    const imgUploadResponse = await handleSingleImageUpload(imgUpData);

    // mongodb update object
    let updateObj = {
      teamLogo: imgUploadResponse.secureURL,
      teamLogoPublicId: imgUploadResponse.publicId,
    };

    // updates mongo db to include the new team logo
    await updateTeamLogo(id, updateObj);

    // handle team colors and send to mongodb
    await updateTeamColors(id, {
      primaryColor,
      secondaryColor,
    });

    const teamDoc = await getTeamById(id);

    res.status(200).json(teamDoc);
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

    let imgUploadResponse;
    let updateObj = {};

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
      await async_cloudinaryDeleteImg(teamLogoPublicId);

      // handle image and upload to cloudinary and publicId and url to mongodb
      imgUploadResponse = await handleSingleImageUpload(imgUpData);

      updateObj = {
        teamLogo: imgUploadResponse.secureURL,
        teamLogoPublicId: imgUploadResponse.publicId,
      };

      await updateTeamLogo(id, updateObj);
    }

    if (primaryColor && secondaryColor) {
      await updateTeamColors(id, {
        primaryColor,
        secondaryColor,
      });
    }

    const adminDoc = await getTeamById(id);

    res.status(200).json(adminDoc);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

export { createTeam_post, team_get, teamUdpdate_put };
