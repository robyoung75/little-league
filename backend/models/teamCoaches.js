import mongoose from "mongoose";
import validator_pkg from "validator";

import CoachSchema from "./coach.js";

const Schema = mongoose.Schema;

const TeamCoachesSchema = new Schema({
  teamId: {
    type: String,
    required: true,
  },
  teamUserName: {
    type: String,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  coaches: [CoachSchema],
  date: {
    type: Date,
    default: Date.now,
  },
});

TeamCoachesSchema.pre("save", async (next) => {
  console.log("A new coached is about to be saved");
  next();
});

TeamCoachesSchema.post("save", (doc, next) => {
  console.log("A new coach has been saved to the database", doc);
  next();
});

export default mongoose.model("coaches", TeamCoachesSchema);
