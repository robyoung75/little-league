// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

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

    const authUser = await findAdminUserById(id);

    if (!authUser) {
      const error = new Error("You must be an admin user to post new user");
      throw error;
    }
    const existingUsers = await findUsersById(authUser.teamId);

    req.body.teamName = authUser.teamName;
    req.body.teamUserName = authUser.teamUserName;
    req.body.teamId = authUser.teamId;

    const { firstName, lastName, email, password } = req.body.users;
    const { teamId, teamUserName, teamName } = req.body;

    // if (existingUsers.users.email === email) {
    //     const error = new Error("User email already exists")
    //     throw error
    // }

    if (!existingUsers && authUser) {
      const newUserDoc = await createNewUser({
        teamId,
        teamUserName,
        teamName,
        users: req.body.users,
      });
      res.status(200).json(newUserDoc);
    }

    if (existingUsers && authUser) {
      const filter = { teamId, "users.email": { $ne: email } };
      const update = {
        $push: {
          users: req.body.users,
        },
      };
      const updatedUsersDoc = await addToExistingUsers(filter, update);

      if (!updatedUsersDoc) {
        throw new Error("A user with this email already exists");
      }

      res.status(200).json(updatedUsersDoc);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// new user creates user
export const userCreateUser_post = async (req, res) => {
  // check for existing team...
  const existingTeam = await findTeamByTeamUserName("cottonwoodcolts");

  // check for existing users...
  const existingUsers = await findUsersByTeamUserName("cottonwoodcolts");

  try {
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
        users: req.body.users,
      });

      // create a jwt token
      const token = createJwtToken(newUserDoc._id);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });
      res.status(200).json(newUserDoc);
    }

    if (existingTeam && existingUsers) {
      let teamId = existingTeam.teamId;
      let { email } = req.body.users;
      const filter = { teamId, "users.email": { $ne: email } };
      const update = {
        $push: {
          users: req.body.users,
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
