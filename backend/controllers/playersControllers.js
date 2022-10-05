// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// helper functions
import { async_cloudinaryStreamImgs } from "../utilities/cloudinaryFuctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";
import {
  findAdminUserById,
  findPlayersByTeamId,
  checkForPlayersAndUpdate,
  createNewPlayer,
  updatePlayer,
} from "../utilities/controllerFunctions.js";

// CREATE TEAM PLAYERS

const authPlayers_post = async (req, res) => {
  // console.log({ authPlayers_post_req_body: req.body });
  // console.log({ authPlayers_post_req_files: req.files });

  try {
    if (req.error) {
      console.log({ authPlayers_post: req.error });
      throw req.error;
    }

    // req.userId returns from auth
    const { id } = req.userId;
    const adminUser = await findAdminUserById(id);
    const authUserPlayers = await findPlayersByTeamId(adminUser.teamId);

    let imgTags = [];
    let imageUploadResult;
    let URLS = [];
    let playerImages = [];

    const { firstName, lastName, number, positions, battingStance } = req.body;

    let playerData = {
      firstName,
      lastName,
      number,
      positions,
      battingStance,
      teamId: adminUser.teamId,
    };

    if (req.files.headshotImg) {
      playerImages.push({
        imageTitle: "headshot",
        lastName,
        number,
        image: await sharpImgResize(req.files["headshotImg"][0]),
      });
    }

    if (req.files.offenseImg) {
      playerImages.push({
        imageTitle: "offense",
        lastName,
        number,
        image: await sharpImgResize(req.files["offenseImg"][0]),
      });
    }

    if (req.files.defenseImg) {
      playerImages.push({
        imageTitle: "defense",
        lastName,
        number,
        image: await sharpImgResize(req.files["defenseImg"][0]),
      });
    }

    // HANDLE AND UPLOAD IMAGES TO CLOUDINARY
    if (adminUser && playerImages !== []) {
      // assign image tags to each image
      imgTags = [
        adminUser.teamId,
        adminUser.teamUserName,
        adminUser.teamName,
        firstName,
        lastName,
        number,
        "players",
      ];

      // upload multiple images to cloudinary
      imageUploadResult = await async_cloudinaryStreamImgs(
        playerImages,
        adminUser,
        imgTags
      );

      // provides URLS form player images from imgUploadResponse
      URLS = imageUploadResult.map((player, index) => {
        return player.secure_url;
      });

      // set playerData object images
      playerData.headshotImg = URLS.find((item) => item.includes("headshot"));
      playerData.offenseImg = URLS.find((item) => item.includes("offense"));
      playerData.defenseImg = URLS.find((item) => item.includes("defense"));
    }

    // if adminUser and no authUserPlayerDoc create a teamsPlayersDoc
    if (adminUser && !authUserPlayers) {
      // create new team players post
      const authPlayerDoc = await createNewPlayer({
        teamId: adminUser._id,
        teamUserName: adminUser.teamUserName,
        teamName: adminUser.teamName,
        players: playerData,
      });

      res.status(200).json(authPlayerDoc);
    }
    // if adminUser and authUserPlayers then update the existing authUserPlayersDoc
    if (adminUser && authUserPlayers) {
      const filter = {
        teamId: authUserPlayers.teamId,
        "players.number": { $ne: number },
      };
      const update = {
        $push: {
          players: playerData,
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

// READ ALL PLAYERS DATA

const players_get = async (req, res) => {
  try {
    if (req.error) {
      console.log({ players_get: req.error.message });
      throw req.error;
    }

    const players = await findPlayersByTeamId(req.userTeamId);
    res.status(200).json(players);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// UPDATE PLAYER INFO AND IMAGES
const updatePlayerData_put = async (req, res) => {
  // console.log(req.params);
  // console.log(req.files)
  // console.log(req.body)
  
  const number = req.body.number
  const { id } = req.userId;
  const { teamId } = req.params;

  // get admin user data
  const adminUser = await findAdminUserById(id);

  let updateObj = {
    number: Number(req.body.number),
    newNumber: Number(req.body.newNumber)
  }


const updatedPlayer = await updatePlayer(id, updateObj)

  // res.json({teamId, id, "req.params": req.params})
  // res.json(adminUser)
  res.json(updatedPlayer);
  // res.send(req.body)
};

export { authPlayers_post, players_get, updatePlayerData_put };
