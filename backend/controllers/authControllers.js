// import model schemas from models/...
import AdminUserSchema from "../models/aminUser.js";
import UserSchema from "../models/user.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// import jsonwebtoken functions from createJWT.js
import { createJwtToken, maxAge } from "./createJWT.js";

// create admin user
const adminUser_post = async (req, res) => {
  // req body
  const { firstName, lastName, email, teamName, teamUserName, password } =
    req.body;
  // console.log("adminUser_post >>>> req.userId", req.userId);

  try {
    // if an admin user is logged in
    if (req.userId) {
      const { id } = req.userId;
      // console.log("adminUser_post >>>> req.userId", req.userId);

      // find existing admin users by teamUserName, a unique name and allows for two admins
      let existingAdmin = await AdminUserSchema.find({ teamUserName });

      // check if more than two admin users exist, only two are allowed
      if (existingAdmin.length >= 2) {
        throw Error(
          `you have exceeded the maximum allowed of two admin users. User #1: ${existingAdmin[0].firstName} ${existingAdmin[0].lastName}. User #2: ${existingAdmin[1].firstName} ${existingAdmin[1].lastName}`
        );
      }
      // if there are less than two admin users create a new newAdmin user with mongoose user schema
      const newAdmin = await AdminUserSchema.create({
        firstName,
        lastName,
        email,
        teamName,
        teamUserName,
        teamId: id,
        password,
      });

      // send new user results as json
      res.status(201).json({
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        teamName: newAdmin.teamName,
        teamUserName: newAdmin.teamUserName,
        teamId: newAdmin.teamId,
        password: newAdmin.password,
        admin: newAdmin.admin,
        id: newAdmin._id,
      });
      // if the user is new and there is no admin or jwt auth create new newAdmin users
    } else {
      const newAdmin = await AdminUserSchema.create({
        firstName,
        lastName,
        email,
        teamName,
        teamUserName,
        password,
        teamId: "",
      });

      // create a jwt token
      const token = createJwtToken(newAdmin._id);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

      // set the new newAdmin user team id to the id object. This id will be used to find team info in the database
      const setTeamId = await AdminUserSchema.findByIdAndUpdate(
        newAdmin._id,
        {
          teamId: newAdmin._id,
        },
        { returnOriginal: false }
      );

      // send
      res.status(200).json(setTeamId);
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
