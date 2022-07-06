import mongoose from "mongoose";
import validator_pkg from "validator";
import bcrypt from "bcrypt";

import AdminSchema from "./admin.js";

const { isEmail } = validator_pkg;
const Schema = mongoose.Schema;

const TeamAdminSchema = new Schema({
  teamName: {
    type: String,
    required: [true, "Please enter a minimum six character team user name"],
    lowercase: true,
    minlength: 3,
    maxlength: 20,
  },
  teamUserName: {
    type: String,
    required: [true, "Please enter a unique team user name"],
    // unique: true,
    lowercase: true,
    minlength: 6,
    maxlength: 20,
  },
  teamId: {
    type: String,
  },

  admin: [AdminSchema],

  date: {
    type: Date,
    default: Date.now,
  },
});

// mongoose middleware

// this function will fire after a doc is saved to the database
TeamAdminSchema.post("save", (doc, next) => {
  console.log("A new user was saved", doc);
  next();
});

TeamAdminSchema.pre("save", async (next) => {
  console.log("A new user is about to be saved, hashing password");
  next();
});

// this is a static method that can be used with the TeamAdminSchema model
TeamAdminSchema.statics.login = async function (email, password) {
  console.log({ TeamAdminSchema_statics_login: [email, password] });

  let authUser = await this.findOne(
    { "admin.email": email },
    { admin: { $elemMatch: { email: email } } }
  );

  if (authUser) {
    if (authUser.admin[0].password === password) {
      return authUser;
    }
    let error = new Error("invalid password");

    return { error: error };
  }

  let error = new Error("invalid email");
  return { error: error };
};

export default mongoose.model("admin", TeamAdminSchema);
