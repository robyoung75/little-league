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
  findPlayersByTeamId,
  checkForPlayersAndUpdate,
  createNewPlayer,
  updatePlayer,
  deletePlayer,
} from "../utilities/controllerFunctions.js";

// CREATE TEAM PLAYERS
const authPlayers_post = async (req, res) => {
  // console.log({ authPlayers_post_req_body: req.body });
  // console.log({ authPlayers_post_req_files: req.files });

  try {
    // If no req.userId an error will be thrown req.userId means user is authenticated as admin
    if (req.error) {
      console.log({ authPlayers_post: req.error });
      throw req.error;
    }

    // req.userId returns from auth middleware
    const { id } = req.userId;
    const adminUser = await getAdminUsersById(id);
    const authUserPlayers = await findPlayersByTeamId(adminUser.teamId);

    // image variables
    let imgTags = [];
    let imageUploadResult;
    let playerImages = [];

    const { firstName, lastName, number, positions, battingStance, teamUserName } = req.body;

    let playerData = {
      firstName,
      lastName,
      number,
      positions,
      battingStance,
      teamId: adminUser.teamId,
    };

    // if files resize and push to playerImages array for upload to cloudinary
    if (req.files.headshotImg) {
      playerImages.push({
        teamUserName,
        imageTitle: "headshot",
        firstName,
        lastName,
        number,
        image: await sharpImgResize(req.files["headshotImg"][0]),
      });
    }

    if (req.files.offenseImg) {
      playerImages.push({
        teamUserName,
        imageTitle: "offense",
        firstName,
        lastName,
        number,
        image: await sharpImgResize(req.files["offenseImg"][0]),
      });
    }

    if (req.files.defenseImg) {
      playerImages.push({
        teamUserName,
        imageTitle: "defense",
        firstName,
        lastName,
        number,
        image: await sharpImgResize(req.files["defenseImg"][0]),
      });
    }

    // HANDLE AND UPLOAD IMAGES TO CLOUDINARY IF PLAYERIMAGES IS NOT AN EMPTY ARRAY
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
        imgTags
      );

      // set playerData object images url and public id
      imageUploadResult.map((item) => {
        if (item.secure_url.includes("headshot")) {
          playerData.headshotImg = {
            secureURL: item.secure_url,
            publicId: item.public_id,
          };
        }

        if (item.secure_url.includes("offense")) {
          playerData.offenseImg = {
            secureURL: item.secure_url,
            publicId: item.public_id,
          };
        }

        if (item.secure_url.includes("defense")) {
          playerData.defenseImg = {
            secureURL: item.secure_url,
            publicId: item.public_id,
          };
        }
        return;
      });
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

    // req.userTeamId is returned from authMiddlware function getTeamById()
    const userTeamId = req.userTeamId;

    const players = await findPlayersByTeamId(userTeamId);
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
    } = req.body;

    // console.log(req.body);
    // console.log("updatePlayerData_put req.files >>>>> ", req.files);
    // console.log('req.params ____________________________ ', req.params)
    // console.log({reqUserTeamId: req.userTeamId, reqUserPlayerId: req.userPlayerId})

    // variables
    // console.log(req.userId);
    const { id } = req.userId;
    // const teamId = req.userTeamId;
    const { playerId } = req.query;

    let imgTags = [];
    let imageUploadResult;
    let playerImages = [];
    let publicIdArray = [];

    let updateObj = {
      number: Number(number),
      newNumber: Number(newNumber),
    };

    // to update the player filter by admin id for the correct team of players then by player._id
    let filter = { id: id, "players._id": playerId };

    // console.log("filter", filter);

    // get admin user data
    const adminUser = await findAdminUserById(id);

    // HANDLE IMAGE UPDATES
    if (req.files) {
      // delete images by public_id argument to delete multiple images is and array of public_id

      if (headshotPublicId) {
        publicIdArray.push(headshotPublicId);
      }

      if (offensePublicId) {
        publicIdArray.push(offensePublicId);
      }

      if (defensePublicId) {
        publicIdArray.push(defensePublicId);
      }

      // CLOUDINARY DELETE MULTIPLE IMAGES
      if (publicIdArray !== []) {
        await async_cloudinaryDeleteMultipleImages(publicIdArray);
      }

      // upload new image(s)
      if (req.files.headshotImg) {
        playerImages.push({
          imageTitle: "headshot",
          firstName,
          lastName,
          number,
          image: await sharpImgResize(req.files["headshotImg"][0]),
        });
      }

      if (req.files.offenseImg) {
        playerImages.push({
          imageTitle: "offense",
          firstName,
          lastName,
          number,
          image: await sharpImgResize(req.files["offenseImg"][0]),
        });
      }

      if (req.files.defenseImg) {
        playerImages.push({
          imageTitle: "defense",
          firstName,
          lastName,
          number,
          image: await sharpImgResize(req.files["defenseImg"][0]),
        });
      }

      // UPLOAD NEW IMAGE FILES
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

        // set new url data
        imageUploadResult.map((item) => {
          if (item.secure_url.includes("headshot")) {
            updateObj.headshotImg = {
              secureURL: item.secure_url,
              publicId: item.public_id,
            };
          }
          if (item.secure_url.includes("offense")) {
            updateObj.offenseImg = {
              secureURL: item.secure_url,
              publicId: item.public_id,
            };
          }
          if (item.secure_url.includes("defense")) {
            updateObj.defenseImg = {
              secureURL: item.secure_url,
              publicId: item.public_id,
            };
          }
          return;
        });
      }
    }

    const updatedPlayer = await updatePlayer(filter, updateObj);

    res.json(updatedPlayer);
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
    if (publicIdArray !== []) {
      console.log(publicIdArray);
      await async_cloudinaryDeleteMultipleImages(publicIdArray);
    }

    const deletedPlayer = await deletePlayer(teamId, playerId);
    res.status(200).json(deletedPlayer);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

export {
  authPlayers_post,
  players_get,
  updatePlayerData_put,
  deletePlayer_delete,
};
