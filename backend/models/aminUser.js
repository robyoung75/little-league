import mongoose from "mongoose";
import validator_pkg from "validator";
import bcrypt from "bcrypt";

const { isEmail } = validator_pkg;
const Schema = mongoose.Schema;

const AdminUserSchema = new Schema({
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
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  teamName: {
    type: String,
    required: [true, "Please enter a minimum six character team user name"],
    unique: true,
    lowercase: true,
    minlength: 3,
    maxlength: 20,
  },
  teamUserName: {
    type: String,
    required: [true, "Please enter a unique team user name"],
    unique: true,
    lowercase: true,
    minlength: 6,
    maxlength: 20,
  },
  password: {
    type: String,
    required: [true, `Please enter your password`],
    maxlength: 1024,
    minlength: [6, `Minimum password length 6 characters`],
  },
  admin: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// mongoose middleware

// this function will fire after a doc is saved to the database
AdminUserSchema.post("save", (doc, next) => {
  console.log("A new user was saved", doc);
  next();
});

AdminUserSchema.pre("save", async (next) => {
  console.log("A new user is about to be saved, hashing password");
  next();
});

// this is a static method that can be used with the AdminUserSchema model
AdminUserSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    return user;
  }
  throw Error("Incorrect password");
};

export default mongoose.model("admin", AdminUserSchema);
