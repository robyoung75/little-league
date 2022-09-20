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

    console.log("authTeam_post", id);

    const adminUser = await findAdminUserById(id);
    console.log("authTeam_post", adminUser);
    const existingTeam = await findTeamById(adminUser.teamId);

    let { primaryColor, secondaryColor } = req.body;
    let teamLogo;
    let imgUploadResponse;

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
    }

    if (adminUser && !existingTeam) {
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

export { authTeam_post, team_get };
