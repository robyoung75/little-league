import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import "./PostInput.css";
import { ThemedHeader, ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";
import Avatar from "../Avatar/Avatar";
import ImgFileInput from "../Forms/ImgFileInput";
import { postSchema } from "../../Schema/FormsSchema";
import {
  handleImgCancel,
  handleImgPreview,
  handleMouseOut,
  handleMouseOver,
} from "../../assets/eventHandlers";
import {
  convertFileListToArr,
  imgURL,
  uploadMultipleImgFiles,
} from "../../assets/functions";
import { userPost } from "../../assets/requests";
function PostInput() {
  const [{ theme, userData, authUser }] = useStateValue();
  const [post, setPost] = useState(null);
  const [hovering_2, setHovering_2] = useState(false);
  const [postImgPreview, setPostImgPreview] = useState(null);
  const [postImgFiles, setPostImgFiles] = useState(null);
  const [mouseOverPostImg, setMouseOverPostImg] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(postSchema) });

  const formSubmit = async (data) => {
    if (isSubmitSuccessful) {
      data.postImages = postImgFiles;
      let test = [];

      console.log("data.postImages >>>>> ", data.postImages);
      let formData = new FormData();
      formData.append("firstName", authUser.firstName);
      formData.append("lastName", authUser.lastName);
      formData.append("number", authUser.number);
      formData.append("post", data.post);
      formData.append("teamName", authUser.teamName);
      formData.append("teamUserName", authUser.teamUserName);

      for (let i = 0; i < data.postImages.length; i++) {
        formData.append("postImages", data.postImages[i]);
        test.push(data.postImages[i]);
      }

      // for (const key of Object.keys(postImgFiles)) {
      //   formData.append("postImages", postImgFiles[key])
      // }

      console.log("test >>>>> ", test);

      await userPost(authUser.teamId, formData);

      console.log("PostInputFormSubmit__data", data);
      console.log("postImgFiles", postImgFiles[0]);

      for (const formDataObj of formData.entries()) {
        console.log(`${formDataObj[0]}, ${formDataObj[1]}`);
      }

      reset();
    }
  };

  const handleHovering_2 = () => {
    setHovering_2(true);
  };

  const handleNotHovering_2 = () => {
    setHovering_2(false);
  };

  const handlePostInput = (e) => {
    e.preventDefault();
    console.log("handlePostInput");
    setPost(e.target.value);
  };

  const handlePreview = () => {
    setPostImgPreview(imgURL(postImgFiles[0]));
  };

  const handleImages = (e) => {
    e.preventDefault();
    console.log(e.target.files);
    const imgFileArr = e.target.files;
    const imgURLArr = uploadMultipleImgFiles(imgFileArr);
    setPostImgFiles(e.target.files);
    // setPostImgFiles(convertFileListToArr(imgFileArr))
    setPostImgPreview(imgURLArr[0]);
  };

  return (
    <div className="postInput">

        <form onSubmit={handleSubmit(formSubmit)}>
        <ThemedHeader theme={theme} className="postInput__header">
          <input
            className="postInput__input"
            type="text"
            onChange={handlePostInput}
            placeholder={
              !authUser
                ? "Welcome, sign in to post"
                : `Welcome ${authUser.firstName.slice(0, 1).toUpperCase()} ${
                    authUser.lastName
                  }`
            }
            {...register("post")}
          />
          <div className="postInput__btns">
            <div className="postInput__btn">
              <ImgFileInput
                id="postImages"
                className="postInput__imgInput"
                name="postImages"
                htmlFor="postImages"
                title="Select"
                // onChange={(e) => (
                //   console.log("post frontend image"),
                //   handleImgPreview(e, setPostImgPreview, uploadMultipleImgFiles),
                //   setPostImgFiles(e.target.files),
                //   console.log(e.target.files)
                // )}
                onChange={handleImages}
                onClick={(e) =>
                  handleImgCancel(e, setPostImgPreview, setPostImgFiles)
                }
                preview={postImgPreview}
                alt="playerPost"
                hovering={mouseOverPostImg}
                onMouseOver={() => handleMouseOver(setMouseOverPostImg)}
                onMouseOut={() => handleMouseOut(setMouseOverPostImg)}
                multipleImgs={true}
              />
            </div>

            <div className="postInput__btn">
              <ThemedButton
                className="btn"
                theme={theme}
                hovering={hovering_2}
                onMouseOver={handleHovering_2}
                onMouseOut={handleNotHovering_2}
                type="submit"
              >
                Submit
              </ThemedButton>
            </div>
          </div>
          </ThemedHeader>
        </form>
 
      <div className="postInput__avatar">
        <Avatar />
      </div>
    </div>
  );
}

export default PostInput;
