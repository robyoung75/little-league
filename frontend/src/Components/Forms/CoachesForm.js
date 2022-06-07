import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./Forms.css";
import { coachesSchema } from "../../Schema/FormsSchema";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedButton } from "../../utils/ThemedComponents";
import ImgFileInput from "./ImgFileInput";
import { imgURL } from "../../assets/functions";
import { useNavigate } from "react-router-dom";

import { adminCoachesPost } from "../../assets/requests";

//  eventHandlers
import {
  handleMouseOver,
  handleMouseOut,
  handleNext,
  handleColor,
  handleImgPreview,
  handleImgCancel,
} from "../../assets/eventHandlers";

function CoachesForm({ newCoachesData, setNewCoachesData }) {
  const [{ theme }] = useStateValue();
  const [headshotPreview, setHeadshotPreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [mouseOverHeadShot, setMouseOverHeadShot] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseOverNext, setMouseOverNext] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(coachesSchema) });

  const formSubmit = async (data) => {
    if (isSubmitSuccessful) {
      data.coachImg = headshotPreview;
      console.log("coachesFormSubmit_data", data);

      let formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("headshotImg", imgFile);

      await adminCoachesPost(formData);

      let dataArr = [];

      dataArr = JSON.parse(localStorage.getItem("coaches data")) || [];
      dataArr.push(data);

      localStorage.setItem("coaches data", JSON.stringify(dataArr));

      newCoachesData ? setNewCoachesData(false) : setNewCoachesData(true);

      setHeadshotPreview(null);

      reset();
    }
  };

  return (
    <div className="coachesForm form">
      <h3>Coaches Form</h3>
      <form
        className="coachesForm__form formContainer flexColumn"
        onSubmit={handleSubmit(formSubmit)}
      >
        <label htmlFor="firstName">First name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          aria-describedby="userFirstName"
          {...register("firstName")}
        />
        {errors.firstName && (
          <span className="form__errors">{errors.firstName.message}</span>
        )}
        <label htmlFor="lastName">Last name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          aria-describedby="userLastName"
          {...register("lastName")}
        />
        {errors.lastName && (
          <span className="form__errors">{errors.lastName.message}</span>
        )}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          aria-describedby="userEmail"
          {...register("email")}
        />
        {errors.email && (
          <span className="form__errors">{errors.email.message}</span>
        )}

        <ImgFileInput
          id="headshotImg"
          className="coachesForm__imgUpload"
          name="headshotImg"
          htmlFor="headshotImg"
          title="Select coach headshot image"
          onChange={(e) => (
            console.log("coaches frontend image"),
            handleImgPreview(e, setHeadshotPreview, imgURL),
            setImgFile(e.target.files[0])
          )}
          onClick={(e) => handleImgCancel(e, setHeadshotPreview)}
          preview={headshotPreview}
          alt="coach"
          hovering={mouseOverHeadShot}
          onMouseOver={() => handleMouseOver(setMouseOverHeadShot)}
          onMouseOut={() => handleMouseOut(setMouseOverHeadShot)}
        />
        <div className="formPreview__btns">
          <ThemedButton
            theme={theme}
            hovering={mouseOver}
            onMouseOver={() => handleMouseOver(setMouseOver)}
            onMouseOut={() => handleMouseOut(setMouseOver)}
            type="submit"
          >
            {localStorage.getItem("coaches data")
              ? "Submit Next Coach"
              : "Submit"}
          </ThemedButton>
        </div>

        <div className="formPreview__btns">
          <ThemedButton
            theme={theme}
            hovering={mouseOverNext}
            onMouseOver={() => handleMouseOver(setMouseOverNext)}
            onMouseOut={() => handleMouseOut(setMouseOverNext)}
            onClick={(e) => {
              handleNext(navigate, "/forms/create_schedule");
            }}
          >
            Next
          </ThemedButton>
        </div>
      </form>
    </div>
  );
}

export default CoachesForm;
