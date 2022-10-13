// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import {
  async_cloudinaryDeleteImg,
  async_cloudinaryStreamImg,
} from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";
import {
  findAdminUserById,
  findCoachesByTeamId,
  checkForCoachesAndUpdate,
  createNewCoach,
  updateCoach,
} from "../utilities/controllerFunctions.js";

// CONTROLLERS FOR ADMIN to Create Coaches
export const authCoaches_post = async (req, res) => {
  // console.log("authCoaches_post_req.file", req.file);

  try {
    if (req.error) {
      console.log({ authCoaches_post: error });
      throw req.error;
    }

    // destructured req.userId from auth middleware
    const { id } = req.userId;

    // admin user
    const adminUser = await findAdminUserById(id);

    // list of coaches for adminUsers team
    const authUserCoaches = await findCoachesByTeamId(adminUser.teamId);

    // destructured req.body variables
    let { firstName, lastName, email } = req.body;

    // variablse
    let imgTags = [];
    let imgUploadResponse;
    let coachImage = {};

    // coaches upload to mongodb object
    let coachData = {
      firstName,
      lastName,
      email,
      headshotImg: {},
      teamId: adminUser.teamId,
    };

    // HANDLE AND UPLOAD IMAGES TO CLOUDINARY
    if (adminUser && req.file) {
      let fileResize = await sharpImgResize(req.file);
      coachImage = { img: fileResize, lastName };

      // image tags for cloudinary
      imgTags = [
        adminUser.teamId,
        adminUser.teamUserName,
        adminUser.teamName,
        firstName,
        lastName,
        email,
        "coaches",
      ];

      // upload response from cloudinary, single image stream
      imgUploadResponse = await async_cloudinaryStreamImg(
        coachImage,
        adminUser,
        imgTags
      );

      coachData.headshotImg.secureURL = imgUploadResponse.secure_url;
      coachData.headshotImg.publicId = imgUploadResponse.public_id;
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

// READ COACHES
export const coaches_get = async (req, res) => {
  try {
    if (req.error) {
      console.log({ coaches_get: req.error.message });
      throw req.error;
    }

    // destructure req.params
    const { teamId } = req.params;

    const coachesDoc = await findCoachesByTeamId(teamId);

    res.status(200).json(coachesDoc);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// UPDATE COACHES IMAGE
export const updateCoachData_put = async (req, res) => {
  try {
    if (req.error) {
      console.log({ updateCoachData_put: req.error });
      throw req.error;
    }

    let { headshotPublicId, firstName, lastName, email } = req.body;

    const { id } = req.userId;

    const { coachId } = req.query;

    // variables
    let imgTags = [];
    let imgUploadResponse;
    let coachImage = {};
    let deleteResults;
    let updateObj = { email, headshotImg: { secureURL: null, publicId: null } };

    // to update the coach filter coaches doc by admin id (the teamId) and then by coaches._id
    const filter = { id: id, "coaches._id": coachId };

    // get admin user doc
    const adminUserDoc = await findAdminUserById(id);

    // prepare and upload file
    if (headshotPublicId && req.file) {
      console.log({ updateCoachData_put: req.file });

      // delete existing coach headshot from cloudinary
      deleteResults = await async_cloudinaryDeleteImg(headshotPublicId);

      if (deleteResults.result === "ok") {
        console.log({
          updateCoachData_put_____deleteResults: "fuck yes delete successful",
        });
      }

      // resize image and set coachImage obj data
      const fileResize = await sharpImgResize(req.file);
      coachImage.img = fileResize;
      coachImage.lastName = lastName;
      coachImage.firstName = firstName;

      imgTags = [
        adminUserDoc.teamId,
        adminUserDoc.teamUserName,
        adminUserDoc.teamName,
        firstName,
        lastName,
        email,
        "coaches",
      ];

      // upload response from cloudinary, single image stream
      imgUploadResponse = await async_cloudinaryStreamImg(
        coachImage,
        adminUserDoc,
        imgTags
      );

      updateObj.headshotImg.secureURL = imgUploadResponse.secure_url;
      updateObj.headshotImg.publicId = imgUploadResponse.public_id;

      console.log({ updateCoachData_put_____updateObj: updateObj });
    }

    const updatedCoachDoc = await updateCoach(filter, updateObj);

    res.send(updatedCoachDoc);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
