// import model schemas from models/...
import AdminUserSchema from "../models/aminUser.js";
import UserSchema from "../models/user.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// import jsonwebtoken functions from createJWT.js
import { createJwtToken, maxAge } from "./createJWT.js";
import team from "../models/team.js";

// create admin user
const adminUser_post = async (req, res) => {
  // req body
  const { firstName, lastName, email, teamName, password } = req.body;

  const adminUser = {
    firstName,
    lastName,
    email,
    teamName,
    password,
    admin: true,
  };

  try {
    // newAdmin user with mongoose user schema
    const newAdmin = await AdminUserSchema.create(adminUser);

    // create a jwt token
    const token = createJwtToken(newAdmin._id);
    console.log("token from authControllers adminUser", token);

    // send token as a cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

    // response
    const response = {
      adminFirstName: newAdmin.firstName,
      adminLastName: newAdmin.lastName,
      adminEmail: newAdmin.email,
      teamName: newAdmin.teamName,
      adminPassword: newAdmin.password,
      admin: newAdmin.admin,
    };

    // send newAdminUser
    console.log("newAdmin", response);
    res.status(200).json(response);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

const createUser_post = async (req, res) => {
  const { firstName, lastName, email, password, teamName } = req.body;
  console.log(teamName);
  const adminUser = await AdminUserSchema.findOne({teamName});
  console.log(adminUser);

  try {
    if (adminUser && teamName === adminUser.teamName) {
      const user = {
        firstName,
        lastName,
        email,
        password,
        teamName: adminUser.teamName,
        teamId: adminUser._id
      };
      const newUser = UserSchema.create(user);

      // create a jwt token
      const token = createJwtToken(newUser._id);
      console.log("token from authControllers newUser", token);

      // send token as a cookie
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

      const response = {
        email: newUser.email,
        password: newUser.password,
        teamName: newUser.teamName,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

const signInUser_post = async (req, res) => {
  const { email, password } = req.body;
  const authUser = await AdminUserSchema.login(email, password);
  const token = createJwtToken(authUser._id);
  // send token as a cookie
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });
  res.status(200).json({
    userId: authUser._id,
    userEmail: authUser.email,
  });

  try {
  } catch (error) {}
};

const signOutUser_get = async (req, res) => {
  // empty string replaces existing jwt hence logging out
  // expires in 1ms
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

export { adminUser_post, createUser_post, signInUser_post, signOutUser_get };
