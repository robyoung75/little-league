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
    unique: true,
  },
  positions: {
    type: Array,
    required: [true, 'Please enter at least one player positions'],
    minlength: 1,
    maxlength: 3,
  },
  battingStance: {
    type: Array,
    required: [true, 'Please enter a batting stance'],
    minlength: 1,
    maxlength: 2,
  },
  teamId: {
    type: String,
    // required: true,
  },
  headshotImg: {
    type: Object,
  },
  offenseImg: {
    type: Object,
  },
  defenseImg: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default PlayerSchema;
