import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  firstName: {
    type: String,
    // required: [true, "Please enter your first name"],
    lowercase: true,
    maxlength: 20,
    minlength: 2,
  },
  lastName: {
    type: String,
    // required: [true, "Please enter your last name"],
    lowercase: true,
    maxlength: 20,
    minlength: 2,
  },
  number: {
    type: Number,
    maxlength: 3,
    minlength: 1,
    unique: true,
  },
  post: {
    type: String,
  },
  teamId: {
    type: String,
    required: true,
  },
  postImages: {
    type: Array,
  },
  assetId: {
    type: String,
  },
  publicId: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default PostSchema;
