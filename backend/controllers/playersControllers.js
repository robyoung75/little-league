// import model schemas from models/teamControllers
import AdminUserSchema from "../models/aminUser.js";
import TeamPlayersSchema from "../models/teamPlayers.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import { async_cloudinaryStreamImgs } from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";

// create team players
export const authPlayers_post = async (req, res) => {
  // console.log({ authPlayers_post_req_body: req.body });
  // console.log({ authPlayers_post_req_files: req.files });
  // console.log(req.files.headshotImg);
  // console.log(req.files.offenseImg);
  // console.log(req.files.defenseImg);

  try {

    if (req.error) {
      throw req.error
    }

    // req.userId returns from auth
    const { id } = req.userId;
    req.body.playerImages = [];

    if (req.files.headshotImg) {
      req.body.playerImages.push({
        imageTitle: "headshot",
        image: await sharpImgResize(req.files["headshotImg"][0]),
        playerNumber: req.body.number,
        playerLastName: req.body.lastName,
        playerFirstName: req.body.firstName,
      });
    }

    if (req.files.offenseImg) {
      req.body.playerImages.push({
        imageTitle: "offense",
        image: await sharpImgResize(req.files["offenseImg"][0]),
        playerNumber: req.body.number,
        playerLastName: req.body.lastName,
        playerFirstName: req.body.firstName,
      });
    }

    if (req.files.defenseImg) {
      req.body.playerImages.push({
        imageTitle: "defense",
        image: await sharpImgResize(req.files["defenseImg"][0]),
        playerNumber: req.body.number,
        playerLastName: req.body.lastName,
        playerFirstName: req.body.firstName,
      });
    }

    const authUserDoc = await AdminUserSchema.findById(id);
    const authUserPlayers = await TeamPlayersSchema.findOne({ teamId: id });
    const {
      firstName,
      lastName,
      number,
      positions,
      battingStance,
      teamId,
      playerImages,
    } = req.body;
    // if authUserDoc and no authUserPlayerDoc create a teamsPlayersDoc
    if (authUserDoc && !authUserPlayers) {
      const imgUploadResponse = await async_cloudinaryStreamImgs(
        playerImages,
        teamId,
        authUserDoc.teamUserName
      );
      // console.log("imgUploadResposne >>>>>", imgUploadResponse);
      // provides URLS form player images from imgUploadResponse
      const URLS = imgUploadResponse.map((player, index) => {
        return player.secure_url;
      });
      const playerData = {
        firstName,
        lastName,
        number,
        positions,
        battingStance,
        teamId,
        headshotImg: URLS.find((item) => item.includes("headshot")),
        offenseImg: URLS.find((item) => item.includes("offense")),
        defenseImg: URLS.find((item) => item.includes("defense")),
      };
      // create new team players post
      const authPlayerDoc = await TeamPlayersSchema.create({
        teamId: authUserDoc._id,
        teamUserName: authUserDoc.teamUserName,
        teamName: authUserDoc.teamName,
        players: playerData,
      });
      const response = {
        teamId: authPlayerDoc.teamId,
        teamName: authPlayerDoc.teamName,
        teamUserName: authPlayerDoc.teamUserName,
        players: authPlayerDoc.players,
      };
      res.status(200).json(response);
    }
    // if authUserDoc and authUserPlayers then update the existing authUserPlayersDoc
    if (authUserDoc && authUserPlayers) {
      const imgUploadResponse = await async_cloudinaryStreamImgs(
        playerImages,
        teamId,
        authUserDoc.teamUserName
      );
      // console.log("imgUploadResposne >>>>>", imgUploadResponse);
      // provides URLS form player images from imgUploadResponse
      const URLS = imgUploadResponse.map((player, index) => {
        return player.secure_url;
      });
      const headshotImg = URLS.find((item) => item.includes("headshot"));
      const offenseImg = URLS.find((item) => item.includes("offense"));
      const defenseImg = URLS.find((item) => item.includes("defense"));
      const filter = { teamId };
      const update = {
        $push: {
          players: {
            firstName,
            lastName,
            number,
            positions,
            battingStance,
            teamId,
            headshotImg,
            offenseImg,
            defenseImg,
          },
        },
      };
      const updatedUserDoc = await TeamPlayersSchema.findOneAndUpdate(
        filter,
        update,
        { returnOriginal: false }
      );
      res.send(updatedUserDoc);
    }
  } catch (error) {
    console.log("authPlayers_post ERROR >>>>>", error);
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
