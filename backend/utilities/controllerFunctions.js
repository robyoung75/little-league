import AdminUserSchema from "../models/aminUser.js";

// find auth user by id
export const findUserById = async (mongooseSchema, id) => {
  try {
    return await AdminUserSchema.findById(id);
  } catch (error) {
    console.log({ findUserById: error });
    return error;
  }
};

// MONGO DB ADMIN USER FUNCTIONS

// find admin users by team name
export const findAdminUsersByTeamUserName = async (teamUserName) => {
  try {
    let users = await AdminUserSchema.find({ teamUserName: teamUserName });
    return users;
  } catch (error) {
    return { findAdminUsersByTeamUserName: error };
  }
};

export const findAdminUserById = async (id) => {
  try {
    let user = await AdminUserSchema.findById(id);
    return user;
  } catch (error) {
    return { findAdminUserById: error };
  }
};

// if no current admin and after a new admin is established setTeamId updates the new admin user to include the teamId
export const setTeamId = async (id) => {
  try {
    let teamId = await AdminUserSchema.findByIdAndUpdate(
      id,
      { teamId: id },
      { returnOriginal: false }
    );
    return teamId;
  } catch (error) {
    return { setTeamId: error };
  }
};
