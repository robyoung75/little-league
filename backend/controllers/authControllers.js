// import model schemas from models/...
import TeamAdminSchema from "../models/teamAdmin.js";

// Mongodb helper functions
import {
  createNewAdminUser,
  findAdminUserById,
  createSecondAdminUser,
  setAdminUserTeamId,
  setTeamId,
} from "../utilities/controllerFunctions.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// import jsonwebtoken functions from createJWT.js
import { createJwtToken, maxAge } from "./createJWT.js";

// create admin user
const adminUser_post = async (req, res) => {
  req.body.teamId = "teamId not set";

  let { firstName, lastName, email, teamName, teamUserName, password, teamId } =
    req.body;

  let adminUser = {
    firstName,
    lastName,
    email,
    teamName,
    teamUserName,
    password,
    teamId,
  };

  try {
    // create a brand new admin user who will build the team data
    if (!req.userId) {
      const teamAdmin = { teamName, teamUserName, teamId, admin: adminUser };
      const newAdmin = await createNewAdminUser(teamAdmin);

      // create a jwt token
      const token = createJwtToken(newAdmin._id);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

      // set the new newAdmin user team id to the id object. This id will be used to find team info in the database
      await setTeamId(newAdmin._id);

      // set the new admin user data to include the teamId
      const updatedPlayerDoc = await setAdminUserTeamId(newAdmin._id);

      res.status(200).json(updatedPlayerDoc);
    }
    // if one admin user already exists add the second admin user
    if (req.userId) {
      const { id } = req.userId;
      const existingAdmin = await findAdminUserById(id);
      adminUser.teamId = existingAdmin.teamId;

      // if there are are less than two admin users create the second admin user
      if (existingAdmin.admin.length < 2) {
        let { teamId, email } = adminUser;
        const filter = { teamId, "admin.email": { $ne: email } };
        const update = {
          $push: {
            admin: adminUser,
          },
        };
        const secondAdmin = await createSecondAdminUser(filter, update);

        if (!secondAdmin) {
          throw new Error("A user with this email already exists");
        }
        res.status(200).json(secondAdmin);
      }

      // if existing admin already has two users throw an error as only two admins are allowed
      if (existingAdmin.admin.length >= 2) {
        throw Error(
          `you have exceeded the maximum allowed of two admin users. ${existingAdmin.admin.map(
            (user, index) => {
              return ` user ${index + 1}: ${user.firstName} ${user.lastName} ${
                user.teamName
              }`;
            }
          )}`
        );
      }
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// user sign in
const signInAdminUser_post = async (req, res) => {
  const { email, password } = req.body;

  const authUser = await TeamAdminSchema.login(email, password);

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

const signOutUser_get = async (req, res) => {
  // empty string replaces existing jwt hence logging out
  // expires in 1ms
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

export { adminUser_post, signInAdminUser_post, signOutUser_get };
