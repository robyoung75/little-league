// import model schemas from models/teamControllers
import TeamSchema from "../models/team.js";
import AdminUserSchema from "../models/aminUser.js";
import TeamPlayersSchema from "../models/teamPlayers.js";
import TeamCoachesSchema from "../models/teamCoaches.js";
// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import { async_cloudinaryStreamImg } from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";
import { findUserById } from "../utilities/controllerFunctions.js";

// CONTROLLERS FOR ADMIN to Create Coaches
export const authCoaches_post = async (req, res) => {
  console.log("authCoaches_post");
  console.log("authCoaches_post_req.body", req.body);
  console.log("authCoaches_post_req.userId", req.userId);
  console.log("authCoaches_post_req.file", req.file);

  try {
    let reducedFileSize;

    if (req.error) {
      throw req.error;
    }

    if (req.file) {
      reducedFileSize = await sharpImgResize(req.file);
      console.log(reducedFileSize);
    }

    const { id } = req.userId;
    const authUserDoc = await AdminUserSchema.findById(id);

    const imgUploadResponse = await async_cloudinaryStreamImg(
        reducedFileSize,
        authUserDoc.authId,
        authUserDoc.teamUserName
    )

    const authCoachesDoc = await TeamCoachesSchema.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      headshotImg: imgUploadResponse.secure_url,
    });
    const response = {
      teamId: id,
      firstName: authCoachesDoc.firstName,
      lastName: authCoachesDoc.lastName,
      email: authCoachesDoc.email,
      headshotImg: authCoachesDoc.headshotImg,
    };
    res.status(200).json(response);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
