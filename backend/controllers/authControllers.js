// import model schemas from models/...
import AdminSchema from "../models/adminUser.js";

// import errors functions from errors/errors.js
import { handleErrors } from "../errors/errors.js";

// import jsonwebtoken functions from createJWT.js
import { createJwtToken, maxAge, verifyJwtToken } from "./createJWT.js";

// create admin user
const adminUser_post = async (req, res) => {
  // req body
  const { firstName, lastName, email, password } = req.body;

  try {
    // newAdmin user with mongoose adminUser schema
    const newAdmin = await AdminSchema.create({
      firstName,
      lastName,
      email,
      password,
      admin: true,
    });

    // create a jwt token
    const token = createJwtToken(newAdmin._id);
    console.log(token);
    verifyJwtToken(token, process.env.TOKEN_SECRET)
   
    // send token as a cookie
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 500 });

    // send newAdminUser
    res.status(200).json({
      adminFirstName: newAdmin.firstName,
      adminLastName: newAdmin.lastName,
      adminEmail: newAdmin.email,
      adminPassword: newAdmin.password,
      admin: newAdmin.admin,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).send(errors);
  }
};

const signIn_POST = async (req, res) => {
  const { email, password } = req.body;
};

export { adminUser_post, signIn_POST };
