import TeamAdminSchema from "../models/teamAdmin.js";
import TeamPlayersSchema from "../models/teamPlayers.js";
import TeamCoachesSchema from "../models/teamCoaches.js";
import TeamSchema from "../models/team.js";
import TeamsScheduleSchema from "../models/teamSchedule.js";
import TeamUsersSchema from "../models/teamUsers.js";
import TeamPostsSchema from "../models/teamPost.js";
import team from "../models/team.js";
import UserSchema from "../models/user.js";
import { sharpImgResize } from "./sharpFunctions.js";
import {
  async_cloudinaryStreamImg,
  async_cloudinaryStreamImgs,
} from "./cloudinaryFuctions.js";

// MONGO DB ADMIN USER FUNCTIONS

// create a new admin user
export const createNewAdminUser = async (reqObj) => {
  try {
    const newAdminUser = await TeamAdminSchema.create(reqObj);
    return newAdminUser;
  } catch (error) {
    console.log({ createNewAdminUser: error });
    return { createNewAdminUser: error };
  }
};

// find a team by teamUserName
export const findTeamByTeamUserName = async (teamUserName) => {
  try {
    const existingTeam = await TeamAdminSchema.findOne({
      teamUserName: teamUserName,
    });
    return existingTeam;
  } catch (error) {
    console.log({ findTeamByTeamUserName: error });
    return { findTeamByTeamUserName: error };
  }
};

// configure database when admin user is set up
export const configureDatabase = async (reqObj) => {
  try {
    const teamDoc = await createTeam(reqObj);
    const coachDoc = await createCoaches(reqObj);
    const playerDoc = await createPlayers(reqObj);
    const scheduleDoc = await createSchedules(reqObj);
    const postDoc = await createPosts(reqObj);
    const userDoc = await createNewUsers(reqObj);

    if (
      !teamDoc ||
      !coachDoc ||
      !playerDoc ||
      !scheduleDoc ||
      !postDoc ||
      !userDoc
    ) {
      throw new Error("database failed to configure");
    }
    console.log("successful db configuration");
    return "successful db configuration";
  } catch (error) {
    console.log({ configureDatabase: error });
    return error;
  }
};

// find admin user by id
export const getAdminUsersById = async (id) => {
  try {
    const user = await TeamAdminSchema.findById(id);
    return user;
  } catch (error) {
    console.log({ findAdminUserById: error });
    return { findAdminUserById: error };
  }
};

// if admin is < 2 in length add another admin user
export const updateAdminUsers = async (teamId, updateObj) => {
  try {
    const adminDoc = await TeamAdminSchema.findOneAndUpdate(
      { teamId: teamId, "admin.email": { $ne: updateObj.email } },
      { $push: { admin: updateObj } },
      { returnOriginal: false }
    );
    // saving after the push update to the sub document saves the doc thus calling mongoose middleware
    // await adminDoc.save();
    return adminDoc;
  } catch (error) {
    console.log({ updateAdminUsers: error });
    return { updateAdminUsers: error };
  }
};

// sets the team id of the document to the mongo db doc object
// setTeamId called by createAdminUser_post
export const setTeamId = async (id) => {
  try {
    const teamId = await TeamAdminSchema.findByIdAndUpdate(
      id,
      { teamId: id },
      { returnOriginal: false }
    );
    return teamId;
  } catch (error) {
    console.log({ setTeamId: error });
    return { setTeamId: error };
  }
};

// sets the team id for a specific admin user found in the admin doc admin array
// setAdminUserTeamId is called by createAdminUser_post
export const setAdminUserTeamId = async (id) => {
  try {
    let authUser = TeamAdminSchema.findOneAndUpdate(
      { id, "admin.teamId": "teamId not set" },
      { $set: { "admin.$.teamId": id } },
      { new: true }
    );

    return authUser;
  } catch (error) {
    console.log({ setAdminUserTeamId: error });
    return { setAdminUserTeamId: error };
  }
};

// delete and existing admin user
export const deleteAdminUser = async (teamId, adminId) => {
  try {
    const adminUserDoc = await TeamAdminSchema.findOneAndUpdate(
      { teamId: teamId },
      {
        $pull: {
          admin: {
            _id: adminId,
          },
        },
      },
      { new: true }
    );

    return adminUserDoc;
  } catch (error) {
    console.log({ deleteAdminUser: error });
    return { deleteAdminUser: error };
  }
};

// TEAM CONTROLLER FUNCTIONS - set team colors and name

// create a new team document called by databaseConfiguration
export const createTeam = async (reqObj) => {
  try {
    const newTeam = await TeamSchema.create(reqObj);
    return newTeam;
  } catch (error) {
    console.log({ createTeam: error });
    return { createTeam: error };
  }
};

// update teamLogo
export const updateTeamLogo = async (teamId, updateObj) => {
  console.log(updateObj);
  try {
    const teamDoc = await TeamSchema.findOneAndUpdate(
      { teamId: teamId },
      {
        $currentDate: {
          lastModified: true,
          lastModified: { $type: "date" },
        },
        $set: {
          teamLogo: updateObj.teamLogo,
          teamLogoPublicId: updateObj.teamLogoPublicId,
        },
      },
      {
        new: true,
      }
    );
    return teamDoc;
  } catch (error) {
    console.log({ updatedLogo: error });
    return { updatedLogo: error };
  }
};

// update team colors
export const updateTeamColors = async (id, updateObj) => {
  try {
    const teamDoc = await TeamSchema.findOneAndUpdate(
      { teamId: id },
      {
        $currentDate: {
          lastModified: true,
          lastModified: { $type: "date" },
        },
        $set: {
          primaryColor: updateObj.primaryColor,
          secondaryColor: updateObj.secondaryColor,
        },
      },
      {
        new: true,
      }
    );
    return teamDoc;
  } catch (error) {
    console.log({ updateTeamColors: error });
    return { updateTeamColors: error };
  }
};

// get a team by id
export const getTeamById = async (id) => {
  try {
    const teamDoc = await TeamSchema.findOne({ teamId: id });

    return teamDoc;
  } catch (error) {
    console.log({ getTeamById: error });
    return { getTeamById: error };
  }
};

// PLAYERS CONTROLLER FUNCTIONS - admin adds team player information
// create a new players document. function is called by configure database
export const createPlayers = async (reqObj) => {
  try {
    let update = {
      teamId: reqObj.teamId,
      teamUserName: reqObj.teamUserName,
      teamName: reqObj.teamName,
      players: [],
    };
    const newPlayer = await TeamPlayersSchema.create(update);
    return newPlayer;
  } catch (error) {
    console.log({ createPlayers: error });
    return { createPlayers: error };
  }
};

// create a new player in playersDoc players array
export const createPlayer = async (id, updateObj) => {
  try {
    const playersDoc = await TeamPlayersSchema.findOneAndUpdate(
      { teamId: id, "players.number": { $ne: updateObj.number } },
      { $push: { players: updateObj } },
      { returnOriginal: false }
    );

    // i use save to cause my mongoose middleware to fire on a push to a sub document
    await playersDoc.save();
    return playersDoc;
  } catch (error) {
    console.log({ createPlayer: error });
    return { createPlayer: error };
  }
};

// get all players
export const getPlayersById = async (id) => {
  try {
    const player = await TeamPlayersSchema.findOne({
      teamId: id,
    });

    return player;
  } catch (error) {
    console.log({ getPlayersById: error });
    return { getPlayersById: error };
  }
};

// updates an existing players photos and number

export const updatePlayer = async (id, playerId, updateObj) => {
  console.log({ id, playerId, updateObj });
  try {
    let updateData = {};
    let playersDoc;
    let playerNumber = updateObj.newNumber
      ? updateObj.newNumber
      : updateObj.number;
    updateData.number = playerNumber;

    // update only image
    if (updateObj.headshotImg) {
      updateData.headshotSecureURL = updateObj.headshotImg.secureURL;
      updateData.headshotPublicId = updateObj.headshotImg.publicId;
    }

    if (updateObj.offenseImg) {
      updateData.offenseSecureURL = updateObj.offenseImg.secureURL;
      updateData.offensePublicId = updateObj.offenseImg.publicId;
    }

    if (updateObj.defenseImg) {
      updateData.defenseSecureURL = updateObj.defenseImg.secureURL;
      updateData.defensePublicId = updateObj.defenseImg.publicId;
    }

    console.log({ updateData });

    playersDoc = await TeamPlayersSchema.findOneAndUpdate(
      { teamId: id, "players._id": playerId },
      {
        $set: {
          "players.$.number": updateData.number,
          "players.$.headshotImg.secureURL":
            updateData.headshotSecureURL && updateData.headshotSecureURL,
          "players.$.headshotImg.publicId":
            updateData.headshotPublicId && updateData.headshotPublicId,
          "players.$.offense.secureURL":
            updateData.offenseSecureURL && updateData.offenseSecureURL,
          "players.$.offense.publicId":
            updateData.offensePublicId && updateData.offensePublicId,
          "players.$.defense.secureURL":
            updateData.defenseSecureURL && updateData.defenseSecureURL,
          "players.$.defense.publicId":
            updateData.defensePublicId && updateData.defensePublicId,
        },
      },
      {
        returnOriginal: false,
      }
    );

    return playersDoc;
  } catch (error) {
    console.log({ updatePlayer: error });
    return { updatePlayer: error };
  }
};

// delete a player
export const deletePlayer = async (teamId, playerId) => {
  try {
    const playerdoc = await TeamPlayersSchema.findOneAndUpdate(
      { teamId: teamId },
      {
        $pull: {
          players: {
            _id: playerId,
          },
        },
      },
      { new: true }
    );

    return playerdoc;
  } catch (error) {
    console.log({ deletePlayer: error });
    return { deletePlayer: error };
  }
};

// COACHES CONTROLLER FUNCTIONS - admin adds coaches

// create a new coaches document. function called in database init
export const createCoaches = async (reqObj) => {
  try {
    let update = {
      teamId: reqObj.teamId,
      teamUserName: reqObj.teamUserName,
      teamName: reqObj.teamName,
      coaches: [],
    };
    const newCoach = await TeamCoachesSchema.create(update);
    return newCoach;
  } catch (error) {
    console.log({ createCoaches: error });
    return { createCoaches: error };
  }
};

// get all coaches
export const findCoachesByTeamId = async (id) => {
  try {
    const coach = await TeamCoachesSchema.findOne({
      teamId: id,
    });
    return coach;
  } catch (error) {
    console.log({ findCoachesByTeamId: error });
    return { findCoachesByTeamId: error };
  }
};

// create a new coach in the coaches document coaches array
export const createCoach = async (userTeamId, updateObj) => {
  try {
    console.log({
      checkForCoachesAndUpdate: { req: { userTeamId, updateObj } },
    });
    const coachesDoc = await TeamCoachesSchema.findOneAndUpdate(
      { teamId: userTeamId, "coaches.email": { $ne: updateObj.email } },
      { $push: { coaches: updateObj } },
      { returnOriginal: false }
    );

    // i use save to cause my mongoose middleware to fire on a push to a sub document
    await coachesDoc.save();
    return coachesDoc;
  } catch (error) {
    // console.log({ createCoach: error });
    return error;
  }
};

// update existing coach. email and headshot image can be updated
export const updateCoach = async (userTeamId, coachId, updateObj) => {
  try {
    let updateData = {};
    let updatedCoachesDoc;
    let coachEmail = updateObj.newEmail ? updateObj.newEmail : updateObj.email;
    updateData.email = coachEmail;

    // update only image
    if (updateObj.headshotImg.secureURL) {
      updateData.headshotSecureURL = updateObj.headshotImg.secureURL;
      updateData.headshotPublicId = updateObj.headshotImg.publicId;
    }

    updatedCoachesDoc = await TeamCoachesSchema.findOneAndUpdate(
      { teamId: userTeamId, "coaches._id": coachId },
      {
        $set: {
          "coaches.$.headshotImg.secureURL":
            updateData.headshotSecureURL && updateData.headshotSecureURL,
          "coaches.$.headshotImg.publicId":
            updateData.headshotPublicId && updateData.headshotPublicId,
          "coaches.$.email": updateData.email && updateData.email,
        },
      },
      {
        returnOriginal: false,
      }
    );

    // returns updated coachDoc
    return updatedCoachesDoc;
  } catch (error) {
    console.log({ updatedCoachesDoc: error });
    return { updatedCoachesDoc: error };
  }
};

// delete a coach
export const deleteCoach = async (teamId, coachId) => {
  try {
    const coachDoc = await TeamCoachesSchema.findOneAndUpdate(
      { teamId: teamId },
      {
        $pull: {
          coaches: {
            _id: coachId,
          },
        },
      },
      { new: true }
    );

    return coachDoc;
  } catch (error) {
    console.log({ deleteCoach: error });
    return { deleteCoach: error };
  }
};

// SCHEDULE CONTROLLER FUNCTIONS
// create new schedule document with db initialization
export const createSchedules = async (reqObj) => {
  try {
    let update = {
      teamId: reqObj.teamId,
      teamUserName: reqObj.teamUserName,
      teamName: reqObj.teamName,
      schedule: [],
    };
    const newGame = await TeamsScheduleSchema.create(update);
    return newGame;
  } catch (error) {
    console.log({ createSchedules: error });
    return { createSchedules: error };
  }
};

// create a new schedule in the schedule doc schedule array
export const createSchedule = async (id, updateObj) => {
  try {
    console.log({
      createSchedule: { req: { id, updateObj } },
    });

    const scheduleDoc = await TeamsScheduleSchema.findOneAndUpdate(
      { teamId: id },
      { $push: { schedule: updateObj } },
      { returnOriginal: false }
    );

    // i use save to cause my mongoose middleware to fire on a push to a sub document
    await scheduleDoc.save();
    return scheduleDoc;
  } catch (error) {
    console.log({ createSchedule: error });
    return error;
  }
};

// check if existing teamSchedule exists
export const getTeamSchedule = async (teamUserId) => {
  try {
    const scheduleDoc = await TeamsScheduleSchema.findOne({
      teamId: teamUserId,
    });
    return scheduleDoc;
  } catch (error) {
    console.log({ scheduleDoc: error });
    return { scheduleDoc: error };
  }
};

// ADD A SCHEDULE DATE TO AN EXISTING SCHEDULE DOCUMENT
export const updateTeamSchedule = async (teamUserId, updateObj) => {
  try {
    const updatedSchedule = await TeamsScheduleSchema.findOneAndUpdate(
      { teamId: teamUserId },
      {
        $push: {
          schedule: updateObj,
        },
      },
      { returnOriginal: false }
    );
    await updatedSchedule.save();
    return updatedSchedule;
  } catch (error) {
    console.log({ updateTeamSchedule: error });
    return { updateTeamSchedule: error };
  }
};

// UPDATE AN INDIVIDUAL SCHEDULED DATE IN SCHEDULE DOCUMENT
export const updateScheduleData = async (teamUserId, scheduleId, updateObj) => {
  try {
    // console.log({ updateScheduleData: filter, updateScheduleData: updateObj });

    let updateData = {};
    let update;

    switch (updateObj) {
      case updateObj.opponent:
        updateData.opponent = updateObj.opponent;
      case updateObj.date:
        updateData.date = updateObj.date;
      case updateObj.gameTime:
        updateData.gameTime = updateObj.gameTime;
      case updateObj.arrivalTime:
        updateData.arrivalTime = updateObj.arrivalTime;
      case updateObj.address:
        updateData.address = updateObj.address;
      case updateObj.city:
        updateData.city = updateObj.city;
      case updateObj.zipCode:
        updateData.zipCode = updateObj.zipCode;
      case updateObj.homeAway:
        updateData.homeAway = updateObj.homeAway;
      case updateObj.uniformColor:
        updateData.uniformColor = updateObj.uniformColor;
      default:
        updateData = updateObj;
    }

    update = {
      $set: {
        "schedule.$.opponent": updateData.opponent && updateData.opponent,
        "schedule.$.date": updateData.date && updateData.date,
        "schedule.$.gameTime": updateData.gameTime && updateData.gameTime,
        "schedule.$.arrivalTime":
          updateData.arrivalTime && updateData.arrivalTime,
        "schedule.$.address": updateData.address && updateData.address,
        "schedule.$.city": updateData.city && updateData.city,
        "schedule.$.zipCode": updateData.zipCode && updateData.zipCode,
        "schedule.$.homeAway": updateData.homeAway && updateData.homeAway,
        "schedule.$.uniformColor":
          updateData.uniformColor && updateData.uniformColor,
      },
    };

    const scheduleDoc = await TeamsScheduleSchema.findOneAndUpdate(
      { teamId: teamUserId, "schedule._id": scheduleId },
      update,
      { returnOriginal: false }
    );

    return scheduleDoc;
  } catch (error) {
    console.log({ updateScheduleData: error });
    return { updateScheduleData: error };
  }
};

// delete schedule date
export const deleteSchedule = async (teamId, scheduleId) => {
  try {
    console.log({ hello: "hello from deleteSchedule", teamId, scheduleId });

    const scheduleDoc = await TeamsScheduleSchema.findOneAndUpdate(
      { teamId: teamId },
      {
        $pull: {
          schedule: {
            _id: scheduleId,
          },
        },
      },
      { new: true }
    );

    return scheduleDoc;
  } catch (error) {
    console.log({ deleteCoach: error });
    return { deleteCoach: error };
  }
};

// USER CONTROLLER FUNCTIONS
// check if users exist by teamUserName
export const findUsersByTeamUserName = async (teamUserName) => {
  try {
    const users = await TeamUsersSchema.findOne({ teamUserName });
    return users;
  } catch (error) {
    console.log({ findUsersByTeamUserName: error });
    return { findUsersByTeamUserName: error };
  }
};

// get all users by admin
export const findUsersById = async (teamId) => {
  try {
    const users = await TeamUsersSchema.findOne({
      teamId: teamId,
    });
    return users;
  } catch (error) {
    console.log({ findUsersById: error });
    return { findUsersById: error };
  }
};

// CREATES A NEW USER MONGO DB DOC WHIT DB INITIALIZATION
// create new user
export const createNewUsers = async (reqObj) => {
  try {
    let update = {
      teamId: reqObj.teamId,
      teamUserName: reqObj.teamUserName,
      teamName: reqObj.teamName,
      users: [],
    };
    const newUser = await TeamUsersSchema.create(update);
    return newUser;
  } catch (error) {
    console.log({ createNewUsers: error });
    return { createNewUsers: error };
  }
};

// ADD A NEW USER TO THE USER DOCUMENT USERS ARRAY
// admin add to existing users
export const createNewUser = async (teamId, userObj) => {
  try {
    const updatedUsers = await TeamUsersSchema.findOneAndUpdate(
      { teamId: teamId, "users.email": { $ne: userObj.email } },
      { $push: { users: userObj } },
      { returnOriginal: false }
    );

    await updatedUsers.save();
    return updatedUsers;
  } catch (error) {
    console.log({ createNewUser: error.message });
    return { createNewUser: error.message };
  }
};

// new user creates users account
export const userCreateUser = async (teamUserName, userObj) => {
  try {
    let authUser;
    const updatedUsersDoc = await TeamUsersSchema.findOneAndUpdate(
      {
        teamUserName: teamUserName,
        "users.email": { $ne: userObj.email },
      },
      { $push: { users: userObj } },
      { returnOriginal: false }
    );

    updatedUsersDoc.users.map((user) => {
      if (user.email === userObj.email) {
        return (authUser = user);
      }
    });

    await updatedUsersDoc.save();

    return authUser;
  } catch (error) {
    console.log({ name: error.name, message: error.message });
    return { name: error.name, message: error.message };
  }
};

// DELETE A USER FROM THE USER DOC USERS ARRAY
// delete user
export const deleteUser = async (teamId, userId) => {
  console.log(teamId);
  try {
    const userDoc = await TeamUsersSchema.findOneAndUpdate(
      { teamId: teamId },
      {
        $pull: {
          users: {
            _id: userId,
          },
        },
      },
      { new: true }
    );

    if (userDoc) {
      return userDoc;
    }
  } catch (error) {
    console.log({ deleteUser: error });
    return { deleteUser: error.message };
  }
};

// USER POST CONTROLLER FUNCTIONS
// Read posts if they exist
export const getTeamPosts = async (teamId) => {
  try {
    const postsDoc = await TeamPostsSchema.findOne({
      teamId: teamId,
    });
    console.log({ getTeamPosts: "hello" });
    return postsDoc;
  } catch (error) {
    console.log({ getTeamPosts: error });
    return { getTeamPosts: error };
  }
};

// create a user post if no user posts exist
export const createPosts = async (updateObj) => {
  console.log({ createPosts: updateObj });

  try {
    let update = {
      teamId: updateObj.teamId,
      teamUserName: updateObj.teamUserName,
      teamName: updateObj.teamName,
      posts: [],
    };
    const postsDoc = await TeamPostsSchema.create(update);
    return postsDoc;
  } catch (error) {
    console.log({ createPosts: error });
    return { createPosts: error.message };
  }
};

// update posts, add a post to existing team posts
export const createPost = async (teamId, updateObj) => {
  try {
    const updatedPosts = await TeamPostsSchema.findOneAndUpdate(
      { teamId: teamId },
      { $push: { posts: updateObj } },
      { returnOriginal: false }
    );
    // await updatedPosts.save();
    return updatedPosts;
  } catch (error) {
    console.log({ createPost: error });
    return { createPost: error };
  }
};

// delete post
export const deletePost = async (userId, teamId, postId) => {
  try {
    const postDoc = await TeamPostsSchema.findOneAndUpdate(
      // { teamId: teamId },
      { teamId: teamId, "posts.userId": { $eq: userId } },
      {
        $pull: {
          posts: {
            _id: postId,
          },
        },
      },
      { new: true }
    );

    return postDoc;
  } catch (error) {
    console.log({ deletePost: error });
    return { deletePost: error.message };
  }
};

// HELPER FUNCTIONS

// upload a single image to cloudinary called for create team and coach headshot images
export const handleSingleImageUpload = async (imgUpData) => {
  try {
    let userImage;
    let imgUploadResponse;
    let imgData = {};

    // destructured imgUpData object, the request object...
    let {
      id,
      firstName,
      lastName,
      teamUserName,
      teamName,
      imgFile,
      imgTagName,
    } = imgUpData;

    // used to set the files name and location with cloudinary
    const adminUserObject = { id, teamUserName, firstName, lastName, teamName };

    console.log({ handleSingleImageUpload: adminUserObject });

    // sharp to reduce image size for db storage
    const fileResize = await sharpImgResize(imgFile);
    userImage = { img: fileResize };

    // tags used in cloudinary
    const imgTags = [id, teamUserName, teamName, imgTagName];

    // cloudinary upload new image
    imgUploadResponse = await async_cloudinaryStreamImg(
      userImage,
      adminUserObject,
      imgTags
    );

    // set imageData
    imgData.secureURL = imgUploadResponse.secure_url;
    imgData.publicId = imgUploadResponse.public_id;
    // upload new img data to teamDoc
    // update = await updateTeamLogo(id, imgData);

    return imgData;
  } catch (error) {
    console.log({ handleSingleImageUpload: error });
    return { handleSingleImageUpload: error };
  }
};

// function returns field names from req.files. fieldnames will be used to upload multiple images
// called in setPlayerImgData
export const getReqFilesFieldNames = (filesObj) => {
  let fileList = [];
  for (let img in filesObj) {
    filesObj[img].forEach((file) => {
      fileList.push({ name: file.fieldname });
    });
  }
  return fileList;
};

// function creates array of objects for cloudinary image upload called in handleMultipleImageuploads
const setPlayerImgData = async (
  imgFiles,
  teamName,
  teamUserName,
  firstName,
  lastName
) => {
  const imgNames = getReqFilesFieldNames(imgFiles);
  // console.log({ imgNames });

  return await Promise.all(
    imgNames.map(async (img) => {
      return {
        teamName,
        teamUserName,
        imageTitle: img.name,
        firstName,
        lastName,
        image: await sharpImgResize(imgFiles[img.name][0]),
      };
    })
  );
};

// assigns the correct secure url and public_id from imageUploadResult to update object for mongodb
export const multiImageCreateURL = async (
  postImgFileArr,
  imageUploadResultArr
) => {
  let imgDataArr = [];

  for (let i = 0; i < imageUploadResultArr.length; i++) {
    for (let j = 0; j < postImgFileArr.length; j++) {
      if (
        imageUploadResultArr[i]["secure_url"].includes(
          postImgFileArr[j]["imageTitle"]
        )
      ) {
        imgDataArr.push({
          secureURL: imageUploadResultArr[i]["secure_url"],
          publicId: imageUploadResultArr[i]["public_id"],
          originalName: postImgFileArr[j]["imageTitle"],
        });
      }
    }
  }

  return imgDataArr;
};

// UPLOAD MULTIPLE IMAGES TO CLOUDINARY, return object sent to mongoDB
// RETURNS AN ARRAY OF OBJECTS. EXAMPLE:
// [
//   {
//       "secureURL": "https://res.cloudinary.com/dyxsxutlm/image/upload/v1667834615/cottonwoodcolts/players/cottonwoodcolts_fName_kade_lName_young_title_headshotImg.webp",
//       "publicId": "cottonwoodcolts/players/cottonwoodcolts_fName_kade_lName_young_title_headshotImg",
//       "originalName": "headshotImg"
//   },
//   {
//       "secureURL": "https://res.cloudinary.com/dyxsxutlm/image/upload/v1667834615/cottonwoodcolts/players/cottonwoodcolts_fName_kade_lName_young_title_offenseImg.webp",
//       "publicId": "cottonwoodcolts/players/cottonwoodcolts_fName_kade_lName_young_title_offenseImg",
//       "originalName": "offenseImg"
//   },
// ]
export const handleMultipleImageUploads = async (imgUpData) => {
  try {
    console.log({ handleMultipleImageUploads: imgUpData });

    // variables
    let playerImages;
    let imgUploadResponse;
    let imgData;

    // destructure imageUpData request
    let {
      id,
      firstName,
      lastName,
      number,
      teamUserName,
      teamName,
      imgFiles,
      imgTagName,
    } = imgUpData;

    // tags used in cloudinary
    const imgTags = [id, teamUserName, teamName, imgTagName];

    // returns an array of objects that will be used to upload images to cloudinary.
    playerImages = await setPlayerImgData(
      imgFiles,
      teamName,
      teamUserName,
      firstName,
      lastName
    );

    // upload to cloudinary return response
    imgUploadResponse = await async_cloudinaryStreamImgs(playerImages, imgTags);

    // creates an object for each image including url, public id, and original name.
    // object will be uploaded to mongoDB
    imgData = multiImageCreateURL(playerImages, imgUploadResponse);

    return imgData;
  } catch (error) {
    console.log({ handleMultipleImageUploads: error });
    return { handleMultipleImageUploads: error };
  }
};

// FOR MULTIPLE IMG UPLOADS ASSIGN CLOUDINARY URL, PUBLICID, ORIGINAL NAME TO AN OBJECT FOR MONGO DB UPDATE
export const createImgObjMongoDbUpload = (cloudinaryUploadRes, arrImgNames) => {
  console.log({ cloudinaryUploadRes, arrImgNames });
  if (
    cloudinaryUploadRes.length !== arrImgNames.length ||
    cloudinaryUploadRes.length === 0 ||
    arrImgNames.length === 0
  ) {
    return null;
  }

  let imgDataObj = {};

  arrImgNames.forEach((name, i) => {
    if (cloudinaryUploadRes[i].originalName === name) {
      imgDataObj[name] = cloudinaryUploadRes[i];
    }
  });
  console.log({ imgDataObj });
  return imgDataObj;
};

// SAMPLE OBJECT RETURN createImgObjMongoDbUpload();
// {
//   imgDataObj: {
//     headshotImg: {
//       secureURL: 'https://res.cloudinary.com/dyxsxutlm/image/upload/v1668095874/cottonwoodcolts/players/cottonwoodcolts_fName_steve_lName_jessup_title_headshotImg.webp',
//       publicId: 'cottonwoodcolts/players/cottonwoodcolts_fName_steve_lName_jessup_title_headshotImg',
//       originalName: 'headshotImg'
//     },
//     offenseImg: {
//       secureURL: 'https://res.cloudinary.com/dyxsxutlm/image/upload/v1668095874/cottonwoodcolts/players/cottonwoodcolts_fName_steve_lName_jessup_title_offenseImg.webp',
//       publicId: 'cottonwoodcolts/players/cottonwoodcolts_fName_steve_lName_jessup_title_offenseImg',
//       originalName: 'offenseImg'
//     },
//     defenseImg: {
//       secureURL: 'https://res.cloudinary.com/dyxsxutlm/image/upload/v1668095874/cottonwoodcolts/players/cottonwoodcolts_fName_steve_lName_jessup_title_defenseImg.webp',
//       publicId: 'cottonwoodcolts/players/cottonwoodcolts_fName_steve_lName_jessup_title_defenseImg',
//       originalName: 'defenseImg'
//     }
//   }
// }
