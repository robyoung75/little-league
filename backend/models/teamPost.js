import mongoose from "mongoose";
import PostSchema from './post.js'

const Schema = mongoose.Schema;

const TeamPostsSchema = new Schema({
  teamId: {
    type: String,
    required: [true, "You do not have an account administrator"],
  },

  teamUserName: {
    type: String,
    lowercase: true,
    minlength: 6,
    required: [true, "Please login as an authorized admin user"],
  },

  teamName: {
    type: String,
    lowercase: true,
    minlength: 3,
    required: [true, "Please enter a team name"],
  },

  posts: [PostSchema],

  date: {
    type: Date,
    default: Date.now,
  },
});

// // mongoose middleware
// // this function will fire before the doc is saved to the database.
// TeamPostsSchema.pre("save", async (next) => {
//   console.log("A new post data set is going to be saved to the server");
//   next();
// });

// // this function will fire after a doc is saved to the database
// TeamPostsSchema.post("save", function (doc, next) {
//   const posts = doc.posts;
//   const newPost = posts.length - 1;
//   console.log(
//     "Hello from TeamPostsSchema: A new post data was saved to the server",
//     posts[newPost]
//   );
//   next();
// });

export default mongoose.model("posts", TeamPostsSchema);
