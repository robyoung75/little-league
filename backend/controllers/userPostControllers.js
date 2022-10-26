// USER POSTS

import { handleErrors } from "../errors/errors.js";
import { async_cloudinaryStreamImgs } from "../utilities/cloudinaryFuctions.js";
import { userCreatePost } from "../utilities/controllerFunctions.js";
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
    const { id } = req.userId;
    const teamUserId = req.userTeamId;
    console.log({ id: id, teamUserId: teamUserId });

    const { teamUserName, teamName, firstName, lastName, number, post } =
      req.body;

    if (req.files) {
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

      let postData = {
        teamUserName,
        firstName,
        lastName,
        number,
        teamId: teamUserId,
        post,
        postImages,
      };

      let updateObj = {
        teamId: teamUserId,
        teamUserName: teamUserName,
        teamName: teamName,
        posts: postData,
      };

      // const asyncImgResults = await Promise.all(
      //   req.files.postImages.map(async (img) => {
      //     return postImages.push({
      //       teamUserName,
      //       imageTitle: img.originalname,
      //       firstName,
      //       lastName,
      //       number: number ? number : null,
      //       image: await sharpImgResize(img),

      //     });
      //   })
      // );

      // imageUploadResult = await async_cloudinaryStreamImgs(postImages, imgTags);

      const test = (postImages, imageUploadResult) => {
        
        return "hello";
      };

      // const postDoc = await userCreatePost(updateObj);

      // res.status(200).json(postDoc);
      // res.status(200).send(imageUploadResult);
      // res.status(200).send(updateObj)
      res.status(200).send(test());
    }
  } catch (error) {
    console.log({ userCreatePost_post: error });
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

// READ POST

// UPDATE POST

// DELETE POST
