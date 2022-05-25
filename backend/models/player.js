import mongoose from "mongoose";
import validator_pkg from "validator";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
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
  number: {
    type: Number,
    required: [true, "Please enter players number"],
    maxlength: 3,
    minlength: 1,
  },
  positions: {
    type: Array,
    minlength: 1,
    maxlength: 3,
  },
  battingStance: {
    type: Array,
    minlength: 1,
    maxlength: 2,
  },
  teamId: {
    type: String,
    required: true,
  },

});

export default PlayerSchema;
