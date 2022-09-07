import TeamAdminSchema from "../models/teamAdmin.js";
import TeamPlayersSchema from "../models/teamPlayers.js";
import TeamCoachesSchema from "../models/teamCoaches.js";
import TeamSchema from "../models/team.js";
import TeamsScheduleSchema from "../models/teamSchedule.js";
import TeamUsersSchema from "../models/teamUsers.js";

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
    await secondAdmin.save()
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
  try {
    const existingTeam = TeamSchema.findOne({ teamId: id });
    return existingTeam;
  } catch (error) {
    return { findTeamById: error };
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

// check if one player already exists by teamId
export const findOneTeamPlayerById = async (id) => {
  try {
    const player = await TeamPlayersSchema.findOne({
      teamId: id,
    });
    return player;
  } catch (error) {
    return { findOneTeamPlayer: error };
  }
};

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

// COACHES CONTROLLER FUNCTIONS - admin adds coaches

// create a new coach
export const createNewCoach = async (reqObj) => {
  try {
    const newCoach = await TeamCoachesSchema.create(reqObj);
    return newCoach;
  } catch (error) {
    return { createNewCoach: error };
  }
};

// check if any coaches already exist.
export const findOneTeamCoachById = async (id) => {
  try {
    const coach = await TeamCoachesSchema.findOne({
      teamId: id,
    });
    return coach;
  } catch (error) {
    return { findOneTeamCoachById: error };
  }
};

export const checkForCoachesAndUpdate = async (filter, updateObj) => {
  try {
    const updatedCoaches = await TeamCoachesSchema.findOneAndUpdate(
      filter,
      updateObj,
      { returnOriginal: false }
    );
    // i use save to cause my mongoose middleware to fire on a push to a sub document
    await updatedCoaches.save()
    return updatedCoaches;
  } catch (error) {
    return { checkForCoachesAndUpdate: error };
  }
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
    return updatedUsers;
  } catch (error) {
    return { updateTeamSchedule: error.message };
  }
};
