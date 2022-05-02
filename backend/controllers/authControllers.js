// import schemas
import AdminSchema from "../models/adminUser.js";

// import errors functions
import { handleErrors } from "../errors/errors.js";

// import jsonwebtoken
import { createToken, maxAge } from "./createJWT.js";
import jwt from "jsonwebtoken";

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
    const token = createToken(newAdmin._id);
    console.log(token);
    const verifyToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(verifyToken);

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
