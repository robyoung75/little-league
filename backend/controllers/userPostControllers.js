// USER POSTS
import { handleErrors } from "../errors/errors.js";
import { async_cloudinaryStreamImgs } from "../utilities/cloudinaryFuctions.js";
import {
  getTeamPosts,
  userAddPost,
  userCreatePost,
  userPostCreateSecureURL,
} from "../utilities/controllerFunctions.js";
import { sharpImgResize } from "../utilities/sharpFunctions.js";

// CREATE POST
export const userCreatePost_post = async (req, res) => {
  console.log(
    "userCreatePost_post req.files.postImages >>>>>>>>> ",
    req.files.postImages
  );

  try {
    if (req.error) {
      console.log({ userCreatePost_post: req.error });
      throw req.error;
    }

    if (req.files.postImages === undefined) {
      throw new Error("No images are attached for upload, try again");
    }

    const { id } = req.userId;
    const teamUserId = req.userTeamId;
    console.log({ id: id, teamUserId: teamUserId });

    const { teamUserName, teamName, firstName, lastName, number, post } =
      req.body;

    // check for existing teamPosts document in mongoDB
    const existingPosts = await getTeamPosts(teamUserId);

    // image variables
    let imgTags = [
      teamUserId,
      teamUserName,
      teamName,
      firstName,
      lastName,
      "posts",
    ];

    let imageUploadResult;
    let postImages = [];

    // postData for updateObj
    let postData = {
      teamUserName,
      firstName,
      lastName,
      number,
      teamId: teamUserId,
      post,
      postImages,
    };
    // posts update object for mongodb
    let updateObj = {
      teamId: teamUserId,
      teamUserName: teamUserName,
      teamName: teamName,
      posts: postData,
    };

    // resize all images for dbase space
    await Promise.all(
      req.files.postImages.map(async (img) => {
        return postImages.push({
          teamUserName,
          imageTitle: img.originalname,
          firstName,
          lastName,
          number: number ? number : null,
          image: await sharpImgResize(img),
        });
      })
    );

    // updated postDoc
    let postDoc;

    if (!existingPosts) {
      // image upload result to cloudinary
      imageUploadResult = await async_cloudinaryStreamImgs(postImages, imgTags);

      // assigns the correct public_id and secure_url from imageUploadResult
      // to postImages for mongoDB post.
      const URLS = await userPostCreateSecureURL(postImages, imageUploadResult);

      // sets postDataImages to URLS for mongoDB reference
      postData.postImages = URLS;

      // creates a new post
      postDoc = await userCreatePost(updateObj);
    }

    if (existingPosts) {
      // image upload result to cloudinary
      imageUploadResult = await async_cloudinaryStreamImgs(postImages, imgTags);

      // assigns the correct public_id and secure_url from imageUploadResult
      // to postImages for mongoDB post.
      const URLS = await userPostCreateSecureURL(postImages, imageUploadResult);

      // sets postDataImages to URLS for mongoDB reference
      postData.postImages = URLS;

      // pushes new posts to existing teamPosts doc if it exists.
      postDoc = await userAddPost(teamUserId, postData);
    }

    res.status(200).json(postDoc);
  } catch (error) {
    console.log({ userCreatePost_post: error });
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// READ POST

// UPDATE POST

// DELETE POST
