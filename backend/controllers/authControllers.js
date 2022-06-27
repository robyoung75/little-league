// import model schemas from models/...
import AdminUserSchema from "../models/aminUser.js";
import UserSchema from "../models/user.js";

// Mongodb functions
import {
  findAdminUsersByTeamUserName,
  setTeamId,
  createNewAdminUser
} from "../utilities/controllerFunctions.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// import jsonwebtoken functions from createJWT.js
import { createJwtToken, maxAge } from "./createJWT.js";

// create admin user
const adminUser_post = async (req, res) => {
  // req body
  const { firstName, lastName, email, teamName, teamUserName, password } =
    req.body;

  try {
    // if there is at least one admin user and they are logged in
    if (req.userId) {
      const { id } = req.userId;
      req.body.teamId = id
      // console.log("adminUser_post >>>> req.userId", req.userId);

      // find existing admin users by unique teamUserName
      const existingAdmin = await findAdminUsersByTeamUserName(teamUserName);

      // check if more than two admin users exist, only two are allowed
      if (existingAdmin.length >= 2) {
        throw Error(
          `you have exceeded the maximum allowed of two admin users. User #1: ${existingAdmin[0].firstName} ${existingAdmin[0].lastName}. User #2: ${existingAdmin[1].firstName} ${existingAdmin[1].lastName}`
        );
      }

      // if there are less than two admin users create a new newAdmin user with mongoose user schema
      const newAdmin = await createNewAdminUser(req.body);

      // send new user results as json
      res.status(201).json(newAdmin);

      // if the user is new and there is no admin or jwt auth create new newAdmin users
    } else {
      req.body.teamId = ""
      const newAdmin = await createNewAdminUser(req.body);

      // create a jwt token
      const token = createJwtToken(newAdmin._id);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

      // set the new newAdmin user team id to the id object. This id will be used to find team info in the database
      let teamId = await setTeamId(newAdmin._id);

      res.status(200).json(teamId);
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

  try {
    const authUser = await AdminUserSchema.login(email, password);
    if (authUser) {
      // create jwt token
      const token = createJwtToken(authUser._id);
      console.log("jwt new admin user", token);
      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });
      res.status(200).json({
        teamId: authUser._id,
        userEmail: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        teamName: authUser.teamName,
        teamUserName: authUser.teamUserName,
      });
    }
  } catch (error) {
    console.log({ signInUser_post: error });
  }
};

const signOutUser_get = async (req, res) => {
  // empty string replaces existing jwt hence logging out
  // expires in 1ms
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

export { adminUser_post, createUser_post, signInUser_post, signOutUser_get };
