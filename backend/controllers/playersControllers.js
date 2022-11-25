// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import {
  async_cloudinaryDeleteMultipleImages,
  async_cloudinaryStreamImgs,
} from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";
import {
  getAdminUsersById,
  getPlayersById,
  createPlayer,
  createPlayers,
  updatePlayer,
  deletePlayer,
  getReqFilesFieldNames,
  handleMultipleImageUploads,
  createImgObjMongoDbUpload,
} from "../utilities/controllerFunctions.js";

// CREATE TEAM PLAYERS
const createPlayer_post = async (req, res) => {
  try {
    if (req.error) {
      console.log({ createPlayer_post: req.error });
      throw req.error;
    }

    // req.userId returns from auth middleware
    const { id } = req.userId;

    // creates an array of object keys or file names
    const imgNames = Object.keys(req.files);

    // variables
    // destructured req.body
    const {
      firstName,
      lastName,
      number,
      positions,
      battingStance,
      teamUserName,
      teamName,
    } = req.body;

    // player data object upload to mongoDB
    let playerData = {
      firstName,
      lastName,
      number,
      positions,
      battingStance,
      teamId: id,
    };

    // image upload to cloudinary object
    let imgUpData = {
      id,
      firstName,
      lastName,
      number,
      teamUserName,
      teamName,
      imgFiles: req.files,
      imgTagName: "players",
    };

    let mongoDbImgData;

    // UPLOAD IMAGES TO CLOUDINARY
    const imgUploadResponse = await handleMultipleImageUploads(imgUpData);

    // ASSIGN CLOUDINARY URL, PUBLICID, ORIGINAL NAME TO PLAYER DATA
    // for upload to mongodb.
    mongoDbImgData = createImgObjMongoDbUpload(imgUploadResponse, imgNames);
    console.log({ mongoDbImgData });
    playerData.headshotImg = mongoDbImgData.headshotImg;
    playerData.offenseImg = mongoDbImgData.offenseImg;
    playerData.defenseImg = mongoDbImgData.defenseImg;

    const playersDoc = await createPlayer(id, playerData);

    res.send(playersDoc);
  } catch (error) {
    console.log("createPlayer_post ERROR >>>>>", error);
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// READ ALL PLAYERS DATA
const players_get = async (req, res) => {
  try {
    if (req.error) {
      console.log({ players_get: req.error.message });
      throw req.error;
    }

    // req.userTeamId is returned from authMiddlware function getTeamById()
    const userTeamId = req.userTeamId;

    const players = await getPlayersById(userTeamId);
    res.status(200).json(players);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// UPDATE PLAYER INFO AND IMAGES
const updatePlayerData_put = async (req, res) => {
  try {
    // If no req.userId an error will be thrown req.userId means user is authenticated as admin
    if (req.error) {
      console.log({ updatePlayerData_put: req.error });
      throw req.error;
    }

    let {
      headshotPublicId,
      offensePublicId,
      defensePublicId,
      firstName,
      lastName,
      number,
      newNumber,
      teamName,
      teamUserName,
    } = req.body;

    // VARIABLES
    // req variables
    const { id } = req.userId;
    const { playerId } = req.query;

    // IMG VARIABLES
    let imgUploadResponse;
    let publicIdArray = [];
    let mongoDbImgData;

    // PLAYER UPLOAD INFORMATION / DATA
    let playerData = {
      number: Number(number),
      newNumber: Number(newNumber),
    };

    // PREPARE FILES FOR UPLOAD TO CLOUDINARY
    let imgUpData = {
      id,
      firstName,
      lastName,
      number,
      teamUserName,
      teamName,
      imgFiles: req.files,
      imgTagName: "players",
    };

    let imgNames = [];

    // PUSH IMG PUBLIC ID TO ARRAY TO USE WITH CLOUDINARY DELETE IMAGES
    if (headshotPublicId) {
      publicIdArray.push(headshotPublicId);
      imgNames.push("headshotImg");
    }

    if (offensePublicId) {
      publicIdArray.push(offensePublicId);
      imgNames.push("offenseImg");
    }

    if (defensePublicId) {
      publicIdArray.push(defensePublicId);
      imgNames.push("defenseImg");
    }

    if (publicIdArray.length > 0) {
      console.log({ publicIdArray });

      // CLOUDINARY DELETE MULTIPLE IMAGES
      // delete images from cloudinary
      await async_cloudinaryDeleteMultipleImages(publicIdArray);

      imgUploadResponse = await handleMultipleImageUploads(imgUpData);

      // ASSIGN CLOUDINARY URL, PUBLICID, ORIGINAL NAME TO PLAYER DATA
      // for upload to mongodb.
      mongoDbImgData = createImgObjMongoDbUpload(imgUploadResponse, imgNames);

      console.log({ mongoDbImgData });

      playerData.headshotImg = mongoDbImgData.headshotImg;
      playerData.offenseImg = mongoDbImgData.offenseImg;
      playerData.defenseImg = mongoDbImgData.defenseImg;

      console.log({ playerData });
    }

    const playersDoc = await updatePlayer(id, playerId, playerData);
    res.status(200).json(playersDoc);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// delete a player
const deletePlayer_delete = async (req, res) => {
  try {
    const { headshotPublicId, offensePublicId, defensePublicId } = req.body;
    const { teamId } = req.params;
    const { playerId } = req.query;

    console.log({ headshotPublicId, offensePublicId, defensePublicId });

    let publicIdArray = [];

    // delete cloudinary images
    // delete images by public_id argument to delete multiple images is and array of public_id
    headshotPublicId && publicIdArray.push(headshotPublicId);
    offensePublicId && publicIdArray.push(offensePublicId);
    defensePublicId && publicIdArray.push(defensePublicId);

    // CLOUDINARY DELETE MULTIPLE IMAGES
    if (publicIdArray.length > 0) {
      console.log(publicIdArray);
      await async_cloudinaryDeleteMultipleImages(publicIdArray);
    }

    const updatedPlayers = await deletePlayer(teamId, playerId);

    res.status(200).json(updatedPlayers);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

export {
  createPlayer_post,
  players_get,
  updatePlayerData_put,
  deletePlayer_delete,
};
