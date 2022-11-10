// USER POSTS
import { handleErrors } from "../errors/errors.js";
import {
  async_cloudinaryDeleteMultipleImages,
  async_cloudinaryStreamImgs,
} from "../utilities/cloudinaryFuctions.js";
import {
  deletePost,
  getTeamPosts,
  userAddPost,
  userCreatePost,
  multiImageCreateURL,
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
    console.log("id.......................................", id);
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
      userId: id,
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
      const URLS = await multiImageCreateURL(postImages, imageUploadResult);

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
      const URLS = await multiImageCreateURL(postImages, imageUploadResult);

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
export const teamPosts_get = async (req, res) => {
  try {
    if (req.error) {
      console.log({ teamPosts_get: req.error });
      throw req.error;
    }

    const teamPosts = await getTeamPosts(req.userTeamId);

    if (!teamPosts) {
      throw new Error(
        "No team posts were found please sign in or confirm that a team exists"
      );
    }
    res.status(200).send(teamPosts);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// UPDATE POST

// DELETE POST
export const deletePost_delete = async (req, res) => {
  try {
    if (req.error) {
      console.log({ deletePost_delete: req.error });
      throw req.error;
    }

    // img_1...all will be a public id for the cloudinary image
    const { img_1, img_2, img_3, img_4, img_5 } = req.body;

    const teamId = req.userTeamId;
    const postId = req.query.postId;
    const { id } = req.userId;

    let publicIdArr = [];

    // delete cloudinary images by public id
    img_1 && publicIdArr.push(img_1);
    img_2 && publicIdArr.push(img_2);
    img_3 && publicIdArr.push(img_3);
    img_4 && publicIdArr.push(img_4);
    img_5 && publicIdArr.push(img_4);

    if (publicIdArr !== []) {
      await async_cloudinaryDeleteMultipleImages(publicIdArr);
    }

    const postsDoc = await deletePost(id, teamId, postId);

    res.status(200).send(postsDoc);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};
