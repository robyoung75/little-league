// import model schemas from models/...
import TeamAdminSchema from "../models/teamAdmin.js";

// import hashpassword function to hash the password
import { hashPassword } from "../utilities/bcrypt.js";

// Mongodb helper functions
import {
  createNewAdminUser,
  findAdminUserById,
  setAdminUserTeamId,
  setTeamId,
  deleteAdminUser,
  createNewPlayer,
  configureDatabase,
  updateAdminUsers,
} from "../utilities/controllerFunctions.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// import jsonwebtoken functions from createJWT.js
import { createJwtToken, maxAge } from "./createJWT.js";

// CREATE ADMIN USER
const createAdminUser_post = async (req, res) => {
  try {
    req.body.teamId = "teamId not set";

    // req.body destructured
    let {
      firstName,
      lastName,
      email,
      teamName,
      teamUserName,
      password,
      teamId,
    } = req.body;
    // hash the password
    let hashedPassword = await hashPassword(password);

    // adminUser object for upload to mongodb
    let adminUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      teamName,
      teamUserName,
      teamId,
    };

    // obj used to create new admin user document in mongodb
    const teamAdmin = { teamName, teamUserName, teamId, admin: adminUser };

    const newAdmin = await createNewAdminUser(teamAdmin);
    // update new adminuser doc to include the team id. team id is the same as the document object
    const updatedTeamId = await setTeamId(newAdmin._id);
    // updated admin user doc including the team id
    // const updatedAdmin = await setAdminUserTeamId(newAdmin._id);
    console.log(updatedTeamId._id);
    // configures the db documents: coaches, players, posts, schedules, teams, users
    const userDbConfig = await configureDatabase({
      teamId: updatedTeamId._id,
      teamUserName,
      teamName,
    });

    // JWT AUTHENTICATION
    if (updatedTeamId && userDbConfig) {
      // create a jwt token
      const token = createJwtToken(newAdmin._id);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });
      res.status(200).json(updatedTeamId);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// READ ADMIN USERS
// there are only two admin users allowed.

const getAllAdminUsers_get = async (req, res) => {
  try {
    if (req.error) {
      console.log({ getAllAdminUsers_get: req.error.message });
      throw req.error;
    }

    const { id } = req.userId;

    const adminUsersDoc = await findAdminUserById(id);

    res.status(200).json(adminUsersDoc);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// UPDATE ADMIN + ADD SECOND ADMIN
const updateAdminUsers_put = async (req, res) => {
  try {
    if (req.error) {
      throw req.error;
    }

    // returned from auth middleware
    const { id } = req.userId;

    // returned from params middleware
    const teamId = req.userTeamId;

    // req.body destructured
    const { firstName, lastName, email, teamName, teamUserName, password } =
      req.body;

    const existingAdmin = await findAdminUserById(id);
    // check the length of existin admin, only two users allowed
    if (existingAdmin.admin.length >= 2) {
      throw Error(
        `you have exceeded the maximum allowed of two admin users. ${existingAdmin.admin.map(
          (user, index) => {
            return ` user ${index + 1}: ${user.firstName} ${user.lastName} ${
              user.teamName
            } please delete one admin user`;
          }
        )}`
      );
    }

    // hash the password
    const hashedPassword = await hashPassword(password);

    // adminUser object for upload to mongodb
    const adminUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      teamName,
      teamUserName,
      teamId,
    };

    const adminUserDoc = await updateAdminUsers(teamId, adminUser);

    res.status(200).json(adminUserDoc);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// DELETE ONE ADMIN USER
const deleteAdminUser_delete = async (req, res) => {
  try {
    if (req.error) {
      console.log({ allAdminUsers_get: req.error.message });
      throw req.error;
    }
    // console.log({ adminUserUpdateRemoveUser_delete: req.params });

    const { id } = req.userId;
    const { userId } = req.query;

    const teamId = req.userTeamId;

    console.log({ id, userId, teamId });

    const adminUsers = await findAdminUserById(id);

    if (adminUsers.admin.length < 2) {
      throw Error(
        `You only have one admin user that cannot be deleted. ${adminUsers.admin.map(
          (user, index) => {
            return ` user ${index + 1}: ${user.firstName} ${user.lastName} ${
              user.teamName
            }`;
          }
        )}`
      );
    }

    const updatedAdminUsers = await deleteAdminUser(teamId, userId);

    res.status(200).json(updatedAdminUsers);
  } catch (error) {
    console.log(error);
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// user sign in
const signInAdminUser_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log("req.teamId >>>>>>>>>>>>>>>>>>>>>", req.teamId);

    const authUser = await TeamAdminSchema.login(email, password);

    if (authUser.error) throw authUser.error;

    // create jwt token
    const token = createJwtToken(authUser._id);

    // send token as a cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

    res.status(200).json(authUser);
  } catch (error) {
    const errors = handleErrors(error);
    console.log({ message: errors });
    res.status(400).json({ message: errors });
  }
};

// user sign out
const signOutUser_get = async (req, res) => {
  // empty string replaces existing jwt hence logging out
  // expires in 1ms
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

export {
  createAdminUser_post,
  updateAdminUsers_put,
  getAllAdminUsers_get,
  deleteAdminUser_delete,
  signInAdminUser_post,
  signOutUser_get,
};
