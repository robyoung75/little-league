import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  teamName: {
    type: String,
    required: [true, "Admin user must be signed in and provide the teamName"],
  },
  teamUserName: {
    type: String,
    required: [
      true,
      "Admin user must be signed in and provide the teamUserName",
    ],
  },
  teamId: {
    type: String,
    required: [true, "Admin user must be signed in and provide the teamId"],
  },
  opponent: {
    type: String,
    lowercase: true,
    required: [
      true,
      "Please enter an opponent with a minimum of two characters",
    ],
  },
  date: {
    type: String,
    required: [true, "Please enter a valid date"],
  },
  gameTime: {
    type: String,
    required: [true, "Please enter a valid game time"],
  },
  arrivalTime: {
    type: String,
    required: [true, "Please enter a valid arrival time"],
  },
  address: {
    type: String,
  },
  city: {
    type: String,
    required: [true, "Please enter a valid City"],
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  homeAway: {
    type: String,
  },
  uniformColor: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default ScheduleSchema;
