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

    const adminUser = await findAdminUserById(id);
    const authUserCoaches = await findOneTeamCoachById(adminUser.teamId);

    let { firstName, lastName, email } = req.body;
    let imgTags = [];
   
    let imgUploadResponse;
    let playerImage = {};

    let coachData = {
      firstName,
      lastName,
      email,
      headshotImg: imgUploadResponse ? imgUploadResponse.secure_url : null,
      teamId: adminUser.teamId,
    };

    // HANDLE AND UPLOAD IMAGES TO CLOUDINARY
    if (adminUser && req.file) {
      let fileResize = await sharpImgResize(req.file);
      playerImage = { img: fileResize, lastName };

      imgTags = [
        adminUser.teamId,
        adminUser.teamUserName,
        adminUser.teamName,
        firstName,
        lastName,
        email,
        "coaches",
      ];

      imgUploadResponse = await async_cloudinaryStreamImg(
        playerImage,
        adminUser,
        imgTags
      );
    }

    if (adminUser && !authUserCoaches) {
      const authCoachesDoc = await createNewCoach({
        teamId: adminUser.teamId,
        teamUserName: adminUser.teamUserName,
        teamName: adminUser.teamName,
        coaches: coachData,
      });

      res.status(200).json(authCoachesDoc);
    }

    if (adminUser && authUserCoaches) {
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
