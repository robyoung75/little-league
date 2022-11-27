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
  findUsersById,
  createNewUser,
  deleteUser,
  userCreateUser,
  findTeamByTeamUserName,
} from "../utilities/controllerFunctions.js";

// Admin creates users
export const adminCreateUser_post = async (req, res) => {
  try {
    if (req.error) {
      console.log({ authNewUser_post: req.error });
      throw req.error;
    }

    const { id } = req.userId;

    let { firstName, lastName, email, password, teamName, teamUserName } =
      req.body;
    let user = { firstName, lastName, email, teamName, teamUserName };

    user.password = await hashPassword(password);

    const usersDoc = await createNewUser(id, user);

    res.status(200).json(usersDoc);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// new user creates user
export const userCreateUser_post = async (req, res) => {
  try {
    let { firstName, lastName, email, password, teamUserName } = req.body;

    let existingTeam = await findTeamByTeamUserName(teamUserName);

    if (existingTeam) {
      let user = {
        firstName,
        lastName,
        email,
        teamUserName,
        teamId: existingTeam.teamId,
      };
      user.password = await hashPassword(password);

      const userDoc = await userCreateUser(teamUserName, user);

      if (userDoc.name === "TypeError") {
        throw { name: userDoc.name, message: userDoc.message };
      }

      // create a jwt token
      const token = createJwtToken(userDoc._id);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });
      res.status(200).json(userDoc);
    } else {
      throw "no team with that user name exists";
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

    const users = await findUsersById(id);

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

    const teamId = req.userTeamId;
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
