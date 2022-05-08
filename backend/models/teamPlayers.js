import mongoose from "mongoose";
import PlayerSchema from "./player.js";
import validator_pkg from "validator";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const TeamPlayersSchema = new Schema({
  teamId: {
    type: String,
    required: true,
  },
  players: [PlayerSchema],
});

// mongoose middleware
// this function will fire before the doc is saved to the database.
TeamPlayersSchema.pre("save", async (next) => {
  console.log("A new player data set is going to be saved");
  next();
});

// this function will fire after a doc is saved to the database
TeamPlayersSchema.post("save", function (doc, next) {
  console.log("New player data was saved", doc);
  next();
});

export default mongoose.model("teamPlayers", TeamPlayersSchema);
