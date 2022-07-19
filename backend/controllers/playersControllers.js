// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import { async_cloudinaryStreamImgs } from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";
import {
  findAdminUserById,
  findOneTeamPlayerById,
  checkForPlayersAndUpdate,
  createNewPlayer,
} from "../utilities/controllerFunctions.js";

// create team players
export const authPlayers_post = async (req, res) => {
  console.log({ authPlayers_post_req_body: req.body });
  // console.log({ authPlayers_post_req_files: req.files });
  // console.log(req.files.headshotImg);
  // console.log(req.files.offenseImg);
  // console.log(req.files.defenseImg);

  try {
    if (req.error) {
      console.log({ authPlayers_post: req.error });
      throw req.error;
    }

    // req.userId returns from auth
    const { id } = req.userId;
    const authUserDoc = await findAdminUserById(id);
    const authUserPlayers = await findOneTeamPlayerById(authUserDoc.teamId);

    req.body.playerImages = [];

    if (req.files.headshotImg) {
      req.body.playerImages.push({
        imageTitle: "headshot",
        image: await sharpImgResize(req.files["headshotImg"][0]),
      });
    }

    if (req.files.offenseImg) {
      req.body.playerImages.push({
        imageTitle: "offense",
        image: await sharpImgResize(req.files["offenseImg"][0]),
      });
    }

    if (req.files.defenseImg) {
      req.body.playerImages.push({
        imageTitle: "defense",
        image: await sharpImgResize(req.files["defenseImg"][0]),
      });
    }

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
        teamId: authUserDoc.teamId,
        headshotImg: URLS.find((item) => item.includes("headshot")),
        offenseImg: URLS.find((item) => item.includes("offense")),
        defenseImg: URLS.find((item) => item.includes("defense")),
      };
      // create new team players post
      const authPlayerDoc = await createNewPlayer({
        teamId: authUserDoc._id,
        teamUserName: authUserDoc.teamUserName,
        teamName: authUserDoc.teamName,
        players: playerData,
      });

      res.status(200).json(authPlayerDoc);
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
      const filter = {
        teamId: authUserPlayers.teamId,
        "players.number": { $ne: number },
      };
      const update = {
        $push: {
          players: {
            firstName,
            lastName,
            number,
            positions,
            battingStance,
            teamId: authUserPlayers.teamId,
            headshotImg,
            offenseImg,
            defenseImg,
          },
        },
      };
      const updatedPlayersdoc = await checkForPlayersAndUpdate(filter, update);

      if (!updatedPlayersdoc) {
        throw new Error("A player with this number already exists");
      }

      res.status(200).json(updatedPlayersdoc);
    }
  } catch (error) {
    console.log("authPlayers_post ERROR >>>>>", error);
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
