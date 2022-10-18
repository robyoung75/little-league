// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// password hashing with bcrypt
import { hashPassword } from "../utilities/bcrypt.js";

//import schema model
import TeamUserSchema from "../models/teamUsers.js";
import UserSchema from "../models/user.js";

// import jsonwebtoken functions from createJWT.js
import { createJwtToken, maxAge } from "./createJWT.js";

// helper functions
import {
  findTeamByTeamUserName,
  findUsersByTeamUserName,
  findAdminUserById,
  findUsersById,
  createNewUser,
  addToExistingUsers,
  deleteUser,
} from "../utilities/controllerFunctions.js";

// Admin creates users
export const authNewUser_post = async (req, res) => {
  try {
    if (req.error) {
      console.log({ authNewUser_post: req.error });
      throw req.error;
    }

    const { id } = req.userId;

    // check for auth admin user
    const authUser = await findAdminUserById(id);

    if (!authUser) {
      const error = new Error("You must be an admin user to post new user");
      throw error;
    }

    // check for existing users
    const existingUsers = await findUsersById(authUser.teamId);

    let { firstName, lastName, email, password } = req.body;
    const teamId = authUser.teamId;
    let user = { firstName, lastName, email, teamId };
    user.password = await hashPassword(password);

    if (!existingUsers && authUser) {
      const newUserDoc = await createNewUser({
        teamId: authUser.teamId,
        teamUserName: authUser.teamUserName,
        teamName: authUser.teamName,
        users: user,
      });
      res.status(200).json(newUserDoc);
    }

    if (existingUsers && authUser) {
      const filter = { teamId, "users.email": { $ne: email } };
      const update = {
        $push: {
          users: user,
        },
      };
      const updatedUsersDoc = await addToExistingUsers(filter, update);

      if (!updatedUsersDoc) {
        throw new Error("A user with this email already exists");
      }

      res.status(200).json(updatedUsersDoc);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// new user creates user
export const userCreateUser_post = async (req, res) => {
  try {
    let { firstName, lastName, email, password, teamUserName } = req.body;

    // check for existing team...
    const existingTeam = await findTeamByTeamUserName(teamUserName);

    // check for existing users...
    const existingUsers = await findUsersByTeamUserName(teamUserName);

    const teamId = existingTeam.teamId;
    let user = { firstName, lastName, email, teamId };
    user.password = await hashPassword(password);

    if (!existingTeam) {
      const error = new Error(
        "Authorization denied, no existing team found check credentials"
      );
      throw error;
    }

    if (existingTeam && !existingUsers) {
      const newUserDoc = await createNewUser({
        teamId: existingTeam.teamId,
        teamUserName: existingTeam.teamUserName,
        teamName: existingTeam.teamName,
        users: user,
      });

      // create a jwt token
      const token = createJwtToken(newUserDoc._id);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });
      res.status(200).json(newUserDoc);
    }

    if (existingTeam && existingUsers) {
      // let teamId = user.teamId;

      const filter = { teamId: user.teamId, "users.email": { $ne: email } };
      const update = {
        $push: {
          users: user,
        },
      };
      const updatedUsersDoc = await addToExistingUsers(filter, update);

      if (!updatedUsersDoc) {
        throw new Error("A user with this email already exists");
      }

      // create a jwt token
      const token = createJwtToken(updatedUsersDoc._id);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

      res.status(200).json(updatedUsersDoc);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// read all users
export const users_get = async (req, res) => {
  try {
    if (req.error) {
      console.log({ users_get: req.error });
      throw req.error;
    }

    const { id } = req.userId;

    let users = await findUsersById(id);

    // res.json({ users_get: "quieres fumar mota?", users_get: req.body, users });
    res.status(200).json(users);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// delete user
export const deleteUser_delete = async (req, res) => {
  try {
    if (req.error) {
      console.log({ adminDeleteUser: req.error });
      throw req.error;
    }

    let { teamId } = req.params;
    let { userId } = req.query;

    let deletedUser = await deleteUser(teamId, userId);
    res.json({ adminDeleteUser_deletedUser: deletedUser });

    // res.status(200).json({teamId, id, userId})
  } catch (error) {
    console.log({ adminDeleteUser: error });
    const errors = handleErrors(error);
    res.status(400).handleErrors(errors);
  }
};

// user signin
export const signInUser_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const authUser = await TeamUserSchema.login(email, password);
    if (authUser.error) throw authUser.error;

    // create jwt token
    const token = createJwtToken(authUser._id);
    // console.log('usersigninjsontoken', token)

    // send token as a cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

    res.status(200).json(authUser);
  } catch (error) {
    const errors = handleErrors(error);
    console.log({ message: errors });
    res.status(400).json({ message: errors });
  }
};
