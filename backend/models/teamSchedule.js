import mongoose from "mongoose";
import ScheduleSchema from "../models/schedule.js";

const Schema = mongoose.Schema;

const TeamsScheduleSchema = new Schema({
  teamId: {
    type: String,
    required: [true, "User must be signed in and provide a teamId"],
    lowercase: true,
  },
  teamUserName: {
    type: String,
    required: [true, "User must be signed in and provide a teamUserName"],
    lowercase: true,
  },
  teamName: {
    type: String,
    required: [true, "User must be signed in and provide a teamName"],
    lowercase: true,
  },
  schedule: [ScheduleSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

// mongoose middleware
// this function will fire before the doc is saved to the database.
TeamsScheduleSchema.pre("save", async (next) => {
  console.log("A new player data set is going to be saved");
  next();
});

// this function will fire after a doc is saved to the database
TeamsScheduleSchema.post("save", function (doc, next) {

  const schedule = doc.schedule
  const newScheduleDate = schedule.length - 1;

  console.log("New player data was saved", schedule[newScheduleDate]);
  next();
});

export default mongoose.model("schedule", TeamsScheduleSchema);
