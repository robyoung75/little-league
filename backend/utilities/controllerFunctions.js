import TeamAdminSchema from "../models/teamAdmin.js";
import TeamPlayersSchema from "../models/teamPlayers.js";
import TeamCoachesSchema from "../models/teamCoaches.js";
import TeamSchema from "../models/team.js";
import TeamsScheduleSchema from "../models/teamSchedule.js";
// find auth user by id
export const findUserById = async (mongooseSchema, id) => {
  try {
    return await TeamAdminSchema.findById(id);
  } catch (error) {
    console.log({ findUserById: error });
    return error;
  }
};

// MONGO DB ADMIN USER FUNCTIONS

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
      { returnOriginal: false }
    );
    return teamId;
  } catch (error) {
    return { setTeamId: error };
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
    const newPlayer = await TeamCoachesSchema.create(reqObj);
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
