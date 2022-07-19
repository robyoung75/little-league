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

    req.body.teamId = authUser.teamId;
    let { firstName, lastName, email, password, teamId } = req.body;

    const teamUser = {
      teamName: authUser.teamName,
      teamUserName: authUser.teamUserName,
      teamId: authUser.teamId,
    };

    if (!existingUsers && authUser) {
      const newUserDoc = await createNewUser({
        teamId: teamUser.teamId,
        teamUserName: teamUser.teamUserName,
        teamName: teamUser.teamName,
        users: {
          firstName,
          lastName,
          email,
          password: await hashPassword(password),
          teamId,
        },
      });
      res.status(200).json(newUserDoc);
    }

    if (existingUsers && authUser) {
      const filter = { teamId, "users.email": { $ne: email } };
      const update = {
        $push: {
          users: {
            firstName,
            lastName,
            email,
            password: await hashPassword(password),
            teamId,
          },
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
  let { firstName, lastName, email, password, teamUserName } = req.body;

  // check for existing team...
  const existingTeam = await findTeamByTeamUserName(teamUserName);

  // check for existing users...
  const existingUsers = await findUsersByTeamUserName(teamUserName);

  const hashedPassword = await hashPassword(password);

  let user = {};

  try {
    if (!existingTeam) {
      const error = new Error(
        "Authorization denied, no existing team found check credentials"
      );
      throw error;
    }

    if (existingTeam) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = hashedPassword;
      user.teamUserName = teamUserName;
      user.teamName = existingTeam.teamName;
      user.teamId = existingTeam.teamId;
    }

    if (existingTeam && !existingUsers) {
      const newUserDoc = await createNewUser({
        teamId: user.teamId,
        teamUserName: user.teamUserName,
        teamName: user.teamName,
        users: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          teamId: user.teamId,
        },
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
          users: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            teamId: user.teamId,
          },
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

// user signin
export const signInUser_post = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  const authUser = await TeamUserSchema.login(email, password);
  try {
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
