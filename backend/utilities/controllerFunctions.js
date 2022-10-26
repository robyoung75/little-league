import TeamAdminSchema from "../models/teamAdmin.js";
import TeamPlayersSchema from "../models/teamPlayers.js";
import TeamCoachesSchema from "../models/teamCoaches.js";
import TeamSchema from "../models/team.js";
import TeamsScheduleSchema from "../models/teamSchedule.js";
import TeamUsersSchema from "../models/teamUsers.js";
import TeamPostsSchema from "../models/teamPost.js";
import team from "../models/team.js";
import UserSchema from "../models/user.js";

// MONGO DB ADMIN USER FUNCTIONS

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

// find admin users by team name
export const findAdminUsersByTeamId = async (id) => {
  try {
    let users = await TeamAdminSchema.find({ teamId: id });
    return users;
  } catch (error) {
    console.log({ findAdminUsersByTeamUserName: error });
    return { findAdminUsersByTeamUserName: error };
  }
};

// find admin user by id
export const findAdminUserById = async (id) => {
  try {
    const user = await TeamAdminSchema.findById(id);
    return user;
  } catch (error) {
    console.log({ findAdminUserById: error });
    return { findAdminUserById: error };
  }
};

// if admin is < 2 in length add another admin user
export const createSecondAdminUser = async (filter, updateObj) => {
  try {
    const secondAdmin = await TeamAdminSchema.findOneAndUpdate(
      filter,
      updateObj,
      { returnOriginal: false }
    );
    // saving after the push update to the sub document saves the doc thus calling mongoose middleware
    await secondAdmin.save();
    return secondAdmin;
  } catch (error) {
    console.log({ createSecondAdminUser: error });
    return { createSecondAdminUser: error };
  }
};

// if no current admin and after a new admin is established setTeamId updates the new admin user to include the teamId
export const setTeamId = async (id) => {
  try {
    const teamId = await TeamAdminSchema.findByIdAndUpdate(
      id,
      { teamId: id },
      { new: true }
    );
    return teamId;
  } catch (error) {
    console.log({ setTeamId: error });
    return { setTeamId: error };
  }
};

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
export const removeAdminUser = async (updateObj) => {
  try {
    const adminUserDoc = await TeamAdminSchema.findOneAndUpdate(
      { _id: updateObj.userId },
      {
        $pull: {
          admin: {
            firstName: updateObj.firstName,
            lastName: updateObj.lastName,
            email: updateObj.email,
          },
        },
      },
      { new: true }
    );

    // console.log(adminUserDoc);

    return adminUserDoc;
  } catch (error) {
    console.log({ removeAdminUser: error });
    return { removeAdminUser: error };
  }
};

// TEAM CONTROLLER FUNCTIONS - set team colors and name

// create a new team
export const createNewTeam = async (reqObj) => {
  try {
    const newTeam = await TeamSchema.create(reqObj);
    return newTeam;
  } catch (error) {
    console.log({ createNewTeam: error });
    return { createNewTeam: error };
  }
};

// check if team already exists
export const findTeamById = async (id) => {
  console.log("findTeamById>>>>>>>>>>>>>>>>>>>>>>", id);

  try {
    const existingTeam = await TeamSchema.findOne({ teamId: id });
    console.log("findTeamById_existingTeam", existingTeam);
    return existingTeam;
  } catch (error) {
    console.log({ findTeamById: error });
    return { findTeamById: error };
  }
};

// update teamLogo
export const updateTeamLogo = async (filter, updateObj) => {
  try {
    const updatedLogo = await TeamSchema.findOneAndUpdate(filter, updateObj, {
      new: true,
    });
    return updatedLogo;
  } catch (error) {
    console.log({ updatedLogo: error });
    return { updatedLogo: error };
  }
};

// update team colors
export const updateTeamColors = async (filter, updateObj) => {
  try {
    const updatedColors = await TeamSchema.findOneAndUpdate(filter, updateObj, {
      new: true,
    });
    return updatedColors;
  } catch (error) {
    console.log({ updateTeamColors: error });
    return { updateTeamColors: error };
  }
};

// PLAYERS CONTROLLER FUNCTIONS - admin adds team player information

// create a new player
export const createNewPlayer = async (reqObj) => {
  try {
    const newPlayer = await TeamPlayersSchema.create(reqObj);
    return newPlayer;
  } catch (error) {
    console.log({ createNewPlayer: error });
    return { createNewPlayer: error };
  }
};

// check if players document exists by teamId
export const findPlayersByTeamId = async (id) => {
  try {
    const player = await TeamPlayersSchema.findOne({
      teamId: id,
    });
    return player;
  } catch (error) {
    console.log({ findPlayersByTeamId: error });
    return { findPlayersByTeamId: error };
  }
};

// adds a new player to existing players
export const checkForPlayersAndUpdate = async (filter, updateObj) => {
  try {
    const updatedPlayers = await TeamPlayersSchema.findOneAndUpdate(
      filter,
      updateObj,
      { returnOriginal: false }
    );

    // .save() calls mongoose middleware
    await updatedPlayers.save();
    return updatedPlayers;
  } catch (error) {
    console.log({ checkForPlayersAndUpdate: error });
    return { checkForPlayersAndUpdate: error };
  }
};

// get and update a specific player
export const updatePlayer = async (filter, updateObj) => {
  // console.log("updatePlayer_____filter_____", filter);
  // console.log("updatePlayer_____updateObj_____", updateObj);

  try {
    // variables
    let updateData = {};
    let playerNumber = updateObj.newNumber
      ? updateObj.newNumber
      : updateObj.number;
    // console.log("updatePlayer_____playerNumber", playerNumber);
    let update;
    let updatedPlayersDoc;
    updateData.number = playerNumber;

    // update player data in mongodb
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

    update = {
      $set: {
        "players.$.number": updateData.number && updateData.number,
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
    };

    updatedPlayersDoc = await TeamPlayersSchema.findOneAndUpdate(
      filter,
      update,
      {
        returnOriginal: false,
      }
    );

    // returns updated playersdoc
    return updatedPlayersDoc;
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

// create a new coach document
export const createNewCoach = async (reqObj) => {
  try {
    const newCoach = await TeamCoachesSchema.create(reqObj);
    return newCoach;
  } catch (error) {
    console.log({ createNewCoach: error });
    return { createNewCoach: error };
  }
};

// check if coaches document exists
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

// add a coach to the existing coach document
export const checkForCoachesAndUpdate = async (userTeamId, updateObj) => {
  try {
    console.log({
      checkForCoachesAndUpdate: { req: { userTeamId, updateObj } },
    });
    const updatedCoaches = await TeamCoachesSchema.findOneAndUpdate(
      { teamId: userTeamId },
      { $push: { coaches: updateObj } },
      { returnOriginal: false }
    );
    // i use save to cause my mongoose middleware to fire on a push to a sub document
    await updatedCoaches.save();
    return updatedCoaches;
  } catch (error) {
    console.log({ checkForCoachesAndUpdate: error });
    return { checkForCoachesAndUpdate: error };
  }
};

// update single coach data
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

// create new schedule
export const createNewSchedule = async (reqObj) => {
  try {
    const newGame = await TeamsScheduleSchema.create(reqObj);
    return newGame;
  } catch (error) {
    console.log({ createNewSchedule: error });
    return { createNewSchedule: error };
  }
};

// check if existing teamSchedule exists
export const findTeamSchedule = async (teamUserId) => {
  try {
    const existingSchedule = await TeamsScheduleSchema.findOne({
      teamId: teamUserId,
    });
    return existingSchedule;
  } catch (error) {
    console.log({ findTeamSchedule: error });
    return { findTeamSchedule: error };
  }
};

// UPDATE SCHEDULE, ADD A SCHEDULE DATE TO AN EXISTING SCHEDULE DOCUMENT
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
export const updateScheduleDate = async (teamUserId, scheduleId, updateObj) => {
  try {
    // console.log({ updateScheduleDate: filter, updateScheduleDate: updateObj });

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

    const updatedScheduleDate = await TeamsScheduleSchema.findOneAndUpdate(
      { teamId: teamUserId, "schedule._id": scheduleId },
      update,
      { returnOriginal: false }
    );

    return updatedScheduleDate;
  } catch (error) {
    console.log({ updateScheduleDate: error });
    return { updateScheduleDate: error };
  }
};

// delete schedule date
export const deleteScheduleDate = async (teamId, scheduleId) => {
  try {
    console.log({ hello: "hello from deleteScheduleDate", teamId, scheduleId });
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

// check if users already exist.
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

// create new user
export const createNewUser = async (reqObj) => {
  try {
    const newUser = await TeamUsersSchema.create(reqObj);
    return newUser;
  } catch (error) {
    console.log({ createNewUser: error });
    return { createNewUser: error };
  }
};

// add to existing users
export const addToExistingUsers = async (teamId, userObj) => {
  try {
    const updatedUsers = await TeamUsersSchema.findOneAndUpdate(
      { teamId: teamId, "users.email": { $ne: userObj.email } },
      { $push: { users: userObj } },
      { returnOriginal: false }
    );
    await updatedUsers.save();
    return updatedUsers;
  } catch (error) {
    console.log({ addToExistingUsers: error.message });
    return { addToExistingUsers: error.message };
  }
};

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

    return userDoc;
  } catch (error) {
    console.log({ deleteUser: error });
    return { deleteUser: error.message };
  }
};

// USER POST CONTROLLER FUNCTIONS

// create a user post
export const userCreatePost = async (updateObj) => {

  console.log({userCreatePost: updateObj})

  let postsDoc = await TeamPostsSchema.create(updateObj)

  return postsDoc
 
};
