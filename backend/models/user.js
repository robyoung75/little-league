import mongoose from "mongoose";
import validator_pkg from "validator";
import bcrypt from "bcrypt";

const { isEmail } = validator_pkg;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
    lowercase: true,
    maxlength: 20,
    minlength: 2,
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
    lowercase: true,
    maxlength: 20,
    minlength: 2,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },

  password: {
    type: String,
    required: [true, `Please enter your password`],
    maxlength: 1024,
    minlength: [6, `Minimum password length 6 characters`],
  },

  teamId: {
    type: String,
    required: [true, "You do not have an account administrator"],
  },

  date: {
    type: Date,
    default: Date.now,
  },
});


export default UserSchema;
