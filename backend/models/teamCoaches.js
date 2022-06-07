import mongoose from "mongoose";
import validator_pkg from "validator";
const { isEmail } = validator_pkg;
const Schema = mongoose.Schema;

const TeamCoachesSchema = new Schema({
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
    // unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  headshotImg: {
    type: String,
  },
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
