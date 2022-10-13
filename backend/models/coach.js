import mongoose from "mongoose";
import validator_pkg from "validator";

const { isEmail } = validator_pkg;
const Schema = mongoose.Schema;

const CoachSchema = new Schema({
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
  headshotImg: {
    type: Object,
  },
  teamId: {
      type: String,
      required: [true, "Team id is required"]
  },
  date: {
    type: Date,
    default: Date.now,
  },
});




export default CoachSchema
