import TeamAdminSchema from "../models/teamAdmin.js";
import TeamPlayersSchema from "../models/teamPlayers.js";
import TeamCoachesSchema from "../models/teamCoaches.js";
import TeamSchema from "../models/team.js";
import TeamsScheduleSchema from "../models/teamSchedule.js";
import TeamUsersSchema from "../models/teamUsers.js";
import team from "../models/team.js";

// MONGO DB ADMIN USER FUNCTIONS

// find a team by teamUserName
export const findTeamByTeamUserName = async (teamUserName) => {
  try {
    const existingTeam = await TeamAdminSchema.findOne({
      teamUserName: teamUserName,
    });
    return existingTeam;
  } catch (error) {
    return { findTeamByTeamUserName: error };
  }
};

// create a new admin user
export const createNewAdminUser = async (reqObj) => {
  try {
    const newAdminUser = await TeamAdminSchema.create(reqObj);
    return newAdminUser;
  } catch (error) {
    return { createNewAdminUser: error };
  }
};

// find admin users by team name
export const findAdminUsersByTeamId = async (id) => {
  try {
    let users = await TeamAdminSchema.find({ teamId: id });
    return users;
  } catch (error) {
    return { findAdminUsersByTeamUserName: error };
  }
};

// find admin user by id
export const findAdminUserById = async (id) => {
  try {
    const user = await TeamAdminSchema.findById(id);
    return user;
  } catch (error) {
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

    console.log(adminUserDoc);

    return adminUserDoc;
  } catch (error) {
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

    // console.log(
    //   "updateData>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
    //   updateData
    // );

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
    console.log(error);
    return error;
  }
};

// COACHES CONTROLLER FUNCTIONS - admin adds coaches

// create a new coach document
export const createNewCoach = async (reqObj) => {
  try {
    const newCoach = await TeamCoachesSchema.create(reqObj);
    return newCoach;
  } catch (error) {
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
    return { findCoachesByTeamId: error };
  }
};

// add a coach to the existing coach document
export const checkForCoachesAndUpdate = async (filter, updateObj) => {
  try {
    const updatedCoaches = await TeamCoachesSchema.findOneAndUpdate(
      filter,
      updateObj,
      { returnOriginal: false }
    );
    // i use save to cause my mongoose middleware to fire on a push to a sub document
    await updatedCoaches.save();
    return updatedCoaches;
  } catch (error) {
    return { checkForCoachesAndUpdate: error };
  }
};

// update single coach data
export const updateCoach = async (filter, updateObj) => {
  let hello = "hello from updateCoach";
  console.log(hello);

  // let updateData = { filter, updateObj };
  // console.log("updateData______________", updateData)
  let update;
  let updatedCoachesDoc;

  // update only image
  if (updateObj.headshotImg.secureURL !== null && !updateObj.email) {
    update = {
      $set: {
        "coaches.$.headshotImg.secureURL": updateObj.headshotImg.secureURL,
        "coaches.$.headshotImg.publicId": updateObj.headshotImg.publicId,
      },
    };
    // update image and email
  } else if (updateObj.headshotImg.secureURL !== null && updateObj.email) {
    update = {
      $set: {
        "coaches.$.headshotImg.secureURL": updateObj.headshotImg.secureURL,
        "coaches.$.headshotImg.publicId": updateObj.headshotImg.publicId,
        "coaches.$.email": updateObj.email,
      },
    };
    // update email only
  } else {
    update = {
      $set: {
        "coaches.$.email": updateObj.email,
      },
    };
  }

  updatedCoachesDoc = await TeamCoachesSchema.findOneAndUpdate(filter, update, {
    returnOriginal: false,
  });

  // returns updated coachDoc
  return updatedCoachesDoc;
};

// SCHEDULE CONTROLLER FUNCTIONS

// create new schedule
export const createNewSchedule = async (reqObj) => {
  try {
    const newGame = await TeamsScheduleSchema.create(reqObj);
    return newGame;
  } catch (error) {
    return { createNewSchedule: error };
  }
};

// check if existing teamSchedule exists
export const findTeamSchedule = async (id) => {
  try {
    const existingSchedule = await TeamsScheduleSchema.findOne({
      teamId: id,
    });
    return existingSchedule;
  } catch (error) {
    return { findTeamSchedule: error };
  }
};

export const updateTeamSchedule = async (filter, updateObj) => {
  try {
    const updatedSchedule = await TeamsScheduleSchema.findOneAndUpdate(
      filter,
      updateObj,
      { returnOriginal: false }
    );
    await updatedSchedule.save();
    return updatedSchedule;
  } catch (error) {
    return { updateTeamSchedule: error };
  }
};

// USER CONTROLLER FUNCTIONS
// check if users exist by teamUserName
export const findUsersByTeamUserName = async (teamUserName) => {
  try {
    const users = await TeamUsersSchema.findOne({ teamUserName });
    return users;
  } catch (error) {
    return { findUsersByTeamUserName: error };
  }
};

// check if users already exist.
export const findUsersById = async (id) => {
  try {
    const users = await TeamUsersSchema.findOne({
      teamId: id,
    });
    return users;
  } catch (error) {
    return { findUsersById: error };
  }
};

// create new user
export const createNewUser = async (reqObj) => {
  try {
    const newUser = await TeamUsersSchema.create(reqObj);
    return newUser;
  } catch (error) {
    return { createNewUser: error };
  }
};

// add to existing users
export const addToExistingUsers = async (filter, updateObj) => {
  try {
    const updatedUsers = await TeamUsersSchema.findOneAndUpdate(
      filter,
      updateObj,
      { returnOriginal: false }
    );
    await updatedUsers.save();
    return updatedUsers;
  } catch (error) {
    return { updateTeamSchedule: error.message };
  }
};
