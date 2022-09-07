import mongoose from "mongoose";
import PlayerSchema from "./player.js";

const Schema = mongoose.Schema;


const TeamPlayersSchema = new Schema({
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
  players: [PlayerSchema],
  
  date: {
    type: Date,
    default: Date.now,
  },
});

// mongoose middleware
// this function will fire before the doc is saved to the database.
TeamPlayersSchema.pre("save", async (next) => {
  console.log("A new player data set is going to be saved");
  next();
});

// this function will fire after a doc is saved to the database
TeamPlayersSchema.post("save", function (doc, next) {

  const players = doc.players
  const newPlayer = players.length - 1;

  console.log("Hello from TeamPlayersSchema: A new player data was saved", players[newPlayer]);
  next();
});

export default mongoose.model("players", TeamPlayersSchema);
