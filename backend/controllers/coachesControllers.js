// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import { async_cloudinaryStreamImg } from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";
import {
  findAdminUserById,
  findOneTeamCoachById,
  checkForCoachesAndUpdate,
  createNewCoach,
} from "../utilities/controllerFunctions.js";

// CONTROLLERS FOR ADMIN to Create Coaches
export const authCoaches_post = async (req, res) => {
  
  // console.log("authCoaches_post_req.file", req.file);

  try {
    if (req.error) {
      console.log({ authCoaches_post: error });
      throw req.error;
    }

    const { id } = req.userId;
    const authUserDoc = await findAdminUserById(id);
    const authUserCoaches = await findOneTeamCoachById(authUserDoc.teamId);
    req.body.headshotImg = null;
    let { firstName, lastName, email, headshotImg } = req.body;

    if (req.file) {
      headshotImg = await sharpImgResize(req.file);
    }

    if (authUserDoc && !authUserCoaches) {
      const imgUploadResponse = await async_cloudinaryStreamImg(
        headshotImg,
        authUserDoc.teamId,
        authUserDoc.teamUserName
      );

      const coachData = {
        firstName,
        lastName,
        email,
        headshotImg: imgUploadResponse ? imgUploadResponse.secure_url : null,
        teamId: authUserDoc.teamId,
      };

      const authCoachesDoc = await createNewCoach({
        teamId: authUserDoc.teamId,
        teamUserName: authUserDoc.teamUserName,
        teamName: authUserDoc.teamName,
        coaches: coachData,
      });

      res.status(200).json(authCoachesDoc);
    }

    if (authUserDoc && authUserCoaches) {
      const imgUploadResponse = await async_cloudinaryStreamImg(
        headshotImg,
        authUserDoc.authId,
        authUserDoc.teamUserName
      );

      const coachData = {
        firstName,
        lastName,
        email,
        headshotImg: imgUploadResponse ? imgUploadResponse.secure_url : null,
        teamId: authUserCoaches.teamId,
      };

      const filter = {
        teamId: authUserCoaches.teamId,
        "coaches.email": { $ne: email },
      };
      const update = {
        $push: {
          coaches: coachData,
        },
      };

      const updatedCoachesDoc = await checkForCoachesAndUpdate(filter, update);

      if (!updatedCoachesDoc) {
        throw new Error("A user with this email already exists");
      }

      res.status(200).json(updatedCoachesDoc);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
