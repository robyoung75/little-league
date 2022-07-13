import mongoose from "mongoose";
import validator_pkg from "validator";

const { isEmail } = validator_pkg;
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
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
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },

  password: {
    type: String,
    required: [true, `Please enter your password`],
    maxlength: 1024,
    minlength: [6, `Minimum password length 6 characters`],
  },

  teamName: {
    type: String,
    required: true,
  },

  teamUserName: {
    type: String,
    required: true,
  },

  teamId: {
    type: String,
    required: [true],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default AdminSchema;
