// import model schemas from models/...
import AdminUserSchema from "../models/teamAdmin.js";
import TeamAdminSchema from "../models/teamAdmin.js";
import UserSchema from "../models/user.js";

// Mongodb functions
import {
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

  req.body.teamId = ""
  console.log("adminUser_post_reqBody", req.body);
  let { firstName, lastName, email, teamName, teamUserName, password, teamId} =
    req.body;

  let adminUser = {
    firstName,
    lastName,
    email,
    teamName,
    teamUserName,
    password,
    teamId
  };

  try {
    if (!req.userId) {
     

      console.log("adminUser", adminUser)
      const teamAdmin = { teamName, teamUserName, teamId, admin: adminUser };
      const newAdmin = await AdminUserSchema.create(teamAdmin);

      // create a jwt token
      const token = createJwtToken(newAdmin._id);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

      // set the new newAdmin user team id to the id object. This id will be used to find team info in the database
      await setTeamId(newAdmin._id);

      const updatedPlayerDoc = await setAdminUserTeamId(newAdmin._id)
      console.log(updatedPlayerDoc)
      res.status(200).json(updatedPlayerDoc);
    }

    if (req.userId) {
      console.log({ adminUser_post: req.userId });
      const { id } = req.userId;
      const existingAdmin = await findAdminUserById(id);

      if (existingAdmin.admin.length < 2) {
        const filter = existingAdmin.teamId;
        const update = {
          $push: {
            admin: req.body.admin,
          },
        };
        const secondAdmin = await createSecondAdminUser(filter, update);
        res.status(200).json(secondAdmin);
      }
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

const createUser_post = async (req, res) => {
  const { firstName, lastName, email, password, teamName, teamUserName } =
    req.body;

  const adminUser = await AdminUserSchema.findOne({ teamUserName });

  try {
    if (adminUser && teamUserName === adminUser.teamUserName) {
      const user = {
        firstName,
        lastName,
        email,
        password,
        teamName: adminUser.teamName,
        teamUserName: adminUser.teamUserName,
        teamId: adminUser._id,
      };
      const newUser = UserSchema.create(user);

      // create a jwt token
      const token = createJwtToken(newUser._id);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

      // response
      const response = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        teamName: adminUser.teamName,
        teamUserName: adminUser.teamUserName,
        teamId: adminUser._id,
      };

      // send newUser resposne
      res.status(200).send(response);
    }
  } catch (error) {
    const errors = handleErrors(error);
    console.log({ message: errors });
    res.status(400).json({ message: errors });
  }
};

// user sign in
const signInUser_post = async (req, res) => {
  const { email, password } = req.body;
  console.log({ signInUser_post: [email, password] });
  const authUser = await TeamAdminSchema.login(email, password);

  try {
    if (authUser.error) throw authUser.error;

    // create jwt token
    const token = createJwtToken(authUser._id);
    console.log("jwt new admin user", token);

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

export { adminUser_post, createUser_post, signInUser_post, signOutUser_get };
