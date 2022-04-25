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

  const formSubmit = (data) => {
    if (isSubmitSuccessful) {
      let dataArr = [];

      data.coachImg = headshotPreview;

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
        <label htmlFor="fname">First name:</label>
        <input
          type="text"
          id="fname"
          name="fname"
          aria-describedby="userFirstName"
          {...register("firstName")}
        />
        {errors.firstName && (
          <span className="form__errors">{errors.firstName.message}</span>
        )}
        <label htmlFor="lname">Last name:</label>
        <input
          type="text"
          id="lname"
          name="lname"
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
          id="coachImg"
          className="imageUploadContainer"
          name="coachImg"
          htmlFor={"coachImg"}
          title="Select coach headshot image"
          onChange={(e) => handleImgPreview(e, setHeadshotPreview, imgURL)}
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
