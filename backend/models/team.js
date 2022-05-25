import mongoose from "mongoose";
import validator_pkg from "validator";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  teamName: {
    type: String,
    lowercase: true,
    minlength: 3,
    required: [true, "Please enter a team name"],
  },
  primaryColor: {
    type: String,
    minlength: 7,
    required: [true, "Please select a primary color"],
  },
  secondaryColor: {
    type: String,
    minlength: 7,
    required: [true, "Please select a secondary color"],
  },
  teamId: {
    type: String,
    required: [true, "You do not have an account administrator"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  teamLogo: {
    type: String,
    required: true
  }
});

// mongoose middleware
// this function will fire before the doc is saved to the database.
TeamSchema.pre("save", async (next) => {
  console.log("A new team data set is going to be saved");
  next();
});


// this function will fire after a doc is saved to the database
TeamSchema.post("save", function (doc, next) {
  console.log("New team data was saved", doc);
  next();
});

export default mongoose.model("team", TeamSchema);
