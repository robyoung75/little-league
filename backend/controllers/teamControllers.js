// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import {
  async_cloudinaryStreamImg,
  async_cloudinaryDeleteImg,
} from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";
import {
  findAdminUserById,
  createNewTeam,
  findTeamById,
  updateTeamLogo,
} from "../utilities/controllerFunctions.js";

// CONTROLLERS FOR ADMIN TO CREATE A TEAM
// create team
const authTeam_post = async (req, res) => {
  console.log("authTeam_post_req.file", req.file);

  try {
    if (req.error) {
      console.log({ authTeam_post: req.error });
      throw req.error;
    }

    // req.userId returns from auth middleware
    const { id } = req.userId;

    console.log("authTeam_post", id);

    const adminUser = await findAdminUserById(id);
    console.log("authTeam_post", adminUser);
    const existingTeam = await findTeamById(adminUser.teamId);

    let { primaryColor, secondaryColor } = req.body;
    let teamLogo;
    let imgUploadResponse;
    let imgPublicId;

    if (adminUser && existingTeam) {
      throw Error("A team with this id already exists");
    }

    // HANDLE AND UPLOAD IMAGES TO CLOUDINARY
    if (adminUser && req.file) {
      // sharp to reduce image size for db storage
      let fileResize = await sharpImgResize(req.file);
      teamLogo = { img: fileResize };

      const imgTags = [
        adminUser.teamId,
        adminUser.teamUserName,
        adminUser.teamName,
        "teamLogo",
      ];

      // cloudinary upload image returning a result
      imgUploadResponse = await async_cloudinaryStreamImg(
        teamLogo,
        adminUser,
        imgTags
      );

      imgPublicId = imgUploadResponse.public_id;
    }



    if (adminUser && !existingTeam) {
      const authTeamDoc = await createNewTeam({
        teamName: adminUser.teamName,
        teamUserName: adminUser.teamUserName,
        teamId: adminUser.teamId,
        primaryColor,
        secondaryColor,
        teamLogo: imgUploadResponse ? imgUploadResponse.secure_url : null,
        teamLogoPublicId: imgUploadResponse
          ? imgUploadResponse.public_id
          : null,
      });

      res.status(200).json(authTeamDoc);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// READ TEAM
const team_get = async (req, res) => {
  try {
    const team = await findTeamById(req.userTeamId);
    res.status(200).json(team);
  } catch (error) {
    console.log(error);
    const errors = handleErrors(error);
    res.status(400).json({ error });
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

    // variables
    let teamLogo;
    let imgUploadResponse;
    let updatedTeam;

    // get admin user data
    const adminUser = await findAdminUserById(id);

    // check if existing team exists
    let existingTeam = await findTeamById(id);

    // delete existing cloudinary image, add new image
    if (adminUser && existingTeam && req.file) {
      // delete existing image from cloudinary
      const result = await async_cloudinaryDeleteImg(
        existingTeam.teamLogoPublicId
      );
      console.log("teamUpdate_put_result", result);

      // sharp to reduce image size for db storage
      let fileResize = await sharpImgResize(req.file);
      teamLogo = { img: fileResize };

      // tags used in cloudinary
      const imgTags = [
        adminUser.teamId,
        adminUser.teamUserName,
        adminUser.teamName,
        "teamLogo",
      ];

      // cloudinary upload new image
      imgUploadResponse = await async_cloudinaryStreamImg(
        teamLogo,
        adminUser,
        imgTags
      );
    }

    // filter and update object arguments defining new teamlogo and team colors
    const filter = { teamLogoPublicId: existingTeam.teamLogoPublicId };
    const updateObj = {
      $currentDate: {
        lastModified: true,
        "lastModified": { $type: "date" }
     },
      $set: {
        teamLogo: imgUploadResponse
          ? imgUploadResponse.secure_url
          : existingTeam.teamLogo,
        teamLogoPublicId: imgUploadResponse.public_id
          ? imgUploadResponse.public_id
          : existingTeam.teamLogoPublicId,
        primaryColor: req.body.primaryColor
          ? req.body.primaryColor
          : existingTeam.primaryColor,
        secondaryColor: req.body.secondaryColor
          ? req.body.secondaryColor
          : existingTeam.secondaryColor,
      },
    };

    // updateTeamLogo function
    updatedTeam = await updateTeamLogo(filter, updateObj);

    res.status(200).json(updatedTeam);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

export { authTeam_post, team_get, teamUdpdate_put };
