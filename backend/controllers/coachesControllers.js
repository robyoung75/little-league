// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import {
  async_cloudinaryDeleteImg,
  async_cloudinaryStreamImg,
} from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";
import {
  getAdminUsersById,
  findCoachesByTeamId,
  createCoach,
  createCoaches,
  updateCoach,
  deleteCoach,
  handleSingleImageUpload,
} from "../utilities/controllerFunctions.js";

// CONTROLLERS FOR ADMIN to Create Coaches
export const createCoach_post = async (req, res) => {
  // console.log("authCoaches_post_req.file", req.file);

  try {
    if (req.error) {
      console.log({ createCoach_post: error });
      throw req.error;
    }

    // destructured req.userId from auth middleware
    const { id } = req.userId;

    // destructured req.body variables
    let { firstName, lastName, email, teamUserName, teamName } = req.body;

    let imgUpData = {
      id,
      firstName,
      lastName,
      teamUserName,
      teamName,
      imgFile: req.file,
      imgTagName: "coaches",
    };

    let updateObj = {
      firstName,
      lastName,
      email,
      headshotImg: {},
      teamId: id,
    };

    // handle image and upload to cloudinary and publicId and url to mongodb
    const imgUploadResults = await handleSingleImageUpload(imgUpData);

    updateObj.headshotImg.publicId = imgUploadResults.publicId;
    updateObj.headshotImg.secureURL = imgUploadResults.secureURL;

    const newCoach = await createCoach(id, updateObj);

    res.status(200).send(newCoach);
  } catch (error) {
    console.log(error);
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

    let {
      headshotPublicId,
      firstName,
      lastName,
      email,
      teamName,
      teamUserName,
    } = req.body;

    const { id } = req.userId;
    const { coachId } = req.query;

    // variables
    let imgUploadResponse;
    let deleteResults;

    let updateObj = {
      firstName,
      lastName,
      email,
      headshotImg: {},
      teamId: id,
    };

    let imgUpData = {
      id,
      firstName,
      lastName,
      teamUserName,
      teamName,
      imgFile: req.file,
      imgTagName: "coaches",
    };

    // prepare and upload file
    if (headshotPublicId && req.file) {
      console.log({ updateCoachData_put: req.file });

      // delete existing coach headshot from cloudinary
      deleteResults = await async_cloudinaryDeleteImg(headshotPublicId);

      if (deleteResults.result === "ok") {
        console.log({
          updateCoachData_put_____deleteResults: "file successfully deleted",
        });

        // handle image and upload to cloudinary and publicId and url to mongodb
        imgUploadResponse = await handleSingleImageUpload(imgUpData);

        updateObj.headshotImg.publicId = imgUploadResponse.publicId;
        updateObj.headshotImg.secureURL = imgUploadResponse.secureURL;
      }

      const coachDoc = await updateCoach(id, coachId, updateObj);

      res.status(200).json(coachDoc);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// delete coach
export const deleteCoach_delete = async (req, res) => {
  try {
    const { headshotPublicId } = req.body;
    const { teamId } = req.params;
    const { coachId } = req.query;

    await async_cloudinaryDeleteImg(headshotPublicId);

    const coachesDoc = await deleteCoach(teamId, coachId);

    res.status(200).json(coachesDoc);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
