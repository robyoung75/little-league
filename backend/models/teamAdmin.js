import mongoose from "mongoose";
import validator_pkg from "validator";
import bcrypt from "bcrypt";

import AdminSchema from "./admin.js";

const { isEmail } = validator_pkg;
const Schema = mongoose.Schema;

const TeamAdminSchema = new Schema({
  teamName: {
    type: String,
    required: [true, "Please enter a minimum six character team user name"],
    lowercase: true,
    minlength: 3,
    maxlength: 20,
  },
  teamUserName: {
    type: String,
    required: [true, "Please enter a unique team user name"],
    // unique: true,
    lowercase: true,
    minlength: 6,
    maxlength: 20,
  },
  teamId: {
    type: String,
    required: [true, "you do not have a team id"],
  },

  admin: [AdminSchema],

  date: {
    type: Date,
    default: Date.now,
  },
});

// mongoose middleware
// this function will fire before the doc is saved
TeamAdminSchema.pre("save", async function (next) {
  console.log("adminUser about to be saved, hashing password");
  next();
});

// this function will fire after a doc is saved to the database
TeamAdminSchema.post("save", (doc, next) => {
  const admins = doc.admin
  const newAdmin = admins.length - 1;
  console.log("Hello from TeamAdminSchema: A new admin user was saved", admins[newAdmin]);
  next();
});

// this is a static method that can be used with the TeamAdminSchema model
TeamAdminSchema.statics.login = async function (email, password) {
  let user = await this.findOne(
    { "admin.email": email },
    { admin: { $elemMatch: { email: email } } }
  );

  console.log("A new user is signing in >>>>>>>>>>> ", {
    // firstName: user.admin[0].firstName,
    // lastName: user.admin[0].lastName,
    user
  });

  if (user) {
    const authUser = await bcrypt.compare(password, user.admin[0].password);
    if (authUser) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("This email does not exist");
};

export default mongoose.model("admin", TeamAdminSchema);
