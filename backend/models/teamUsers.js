import mongoose from "mongoose";
import validator_pkg from "validator";
import bcrypt from "bcrypt";

import UserSchema from "./user.js";

const { isEmail } = validator_pkg;
const Schema = mongoose.Schema;

const TeamUserSchema = new Schema({
  teamId: {
    type: String,
    required: true,
  },
  teamUserName: {
    type: String,
    required: true,
    unique: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  users: [UserSchema],

  date: {
    type: Date,
    default: Date.now,
  },
});

// mongoose middleware

// this function will fire after a doc is saved to the database
TeamUserSchema.post("save", (doc, next) => {
  console.log("A new user was saved", doc);
  next();
});

TeamUserSchema.pre("save", async (next) => {
  console.log("A new user is about to be saved, hashing password");
  next();
});

// this is a static method that can be used with the UserSchema model
TeamUserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    return user;
  }
  throw Error("Incorrect password");
};

export default mongoose.model("user", TeamUserSchema);
