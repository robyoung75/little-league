import React, { useState } from "react";
import "./Forms.css";

import ImgFileInput from "./ImgFileInput";
import { imgURL, handleFirstLetterCap } from "../../assets/functions";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { teamSchema } from "../../Schema/FormsSchema";
import { ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";
import { useNavigate } from "react-router-dom";
import { adminTeamPost } from "../../assets/requests";

//  eventHandlers
import {
  handleMouseOver,
  handleMouseOut,
  handleNext,
  handleColor,
  handleImgPreview,
  handleImgCancel,
} from "../../assets/eventHandlers";

function TeamForm({ newTeamData, setNewTeamData }) {
  const initialState = {
    primaryColor: "#27251f",
    secondaryColor: "#fdb827",
  };
  const [{ theme, userData, authUser, authTheme }] = useStateValue();
  const [primaryColor, setPrimaryColor] = useState(authTheme.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(
    authTheme.secondaryColor
  );
  const [logoPreview, setLogoPreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);

  const [mouseOver, setMouseOver] = useState(false);
  const [mouseOverFile, setMouseOverFile] = useState(false);
  const [mouseOverNext, setMouseOverNext] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(teamSchema) });

  const formSubmit = async (data) => {
    if (isSubmitSuccessful) {
      data.teamLogo = logoPreview;
      data.teamUserName = authUser.teamUserName;
      data.teamName = authUser.teamName;

      let formData = new FormData();
      formData.append("teamUserName", data.teamUserName);
      formData.append("teamName", data.teamName);
      formData.append("primaryColor", data.primaryColor);
      formData.append("secondaryColor", data.secondaryColor);
      formData.append("teamLogo", imgFile);

      await adminTeamPost(formData);

      localStorage.setItem("teamData", JSON.stringify(data));
      newTeamData ? setNewTeamData(false) : setNewTeamData(true);
      setLogoPreview(null);
      setImgFile(null);
      reset();
    }
  };

  return (
    <div className="teamForm form">
      <h3>
        Team Form: {userData ? handleFirstLetterCap(userData.teamName) : null}
      </h3>
      <form
        className="teamForm__form formContainer flexColumn"
        onSubmit={handleSubmit(formSubmit)}
      >
        <label htmlFor="primaryColor">Select your primary color</label>
        <input
          type="color"
          id="primaryColor"
          name="primaryColor"
          value={primaryColor}
          onInput={(e) => handleColor(e, setPrimaryColor)}
          aria-describedby="primary team color"
          {...register("primaryColor")}
        />
        <label htmlFor="secondaryColor">Select your secondary color</label>
        <input
          type="color"
          id="secondaryColor"
          name="secondaryColor"
          value={secondaryColor}
          onInput={(e) => handleColor(e, setSecondaryColor)}
          aria-describedby="secondary team color"
          {...register("secondaryColor")}
        />

        <ImgFileInput
          id="teamLogo"
          className="teamForm__imgUpload"
          name="teamLogo"
          htmlFor="teamLogo"
          title="Select team logo image"
          onChange={(e) => (
            console.log("teamForm image"),
            handleImgPreview(e, setLogoPreview, imgURL),
            setImgFile(e.target.files[0])
          )}
          onClick={(e) => handleImgCancel(e, setLogoPreview)}
          preview={logoPreview}
          alt="team logo"
          hovering={mouseOverFile}
          onMouseOver={() => handleMouseOver(setMouseOverFile)}
          onMouseOut={() => handleMouseOut(setMouseOverFile)}
        />
        <div className="formPreview__btns">
          <ThemedButton
            className="formPreview__btn"
            theme={authTheme}
            hovering={mouseOver}
            onMouseOver={() => handleMouseOver(setMouseOver)}
            onMouseOut={() => handleMouseOut(setMouseOver)}
            type="submit"
          >
            Submit
          </ThemedButton>
        </div>

        <div className="formPreview__btns">
          <ThemedButton
            className="formPreview__btn"
            theme={authTheme}
            hovering={mouseOverNext}
            onMouseOver={() => handleMouseOver(setMouseOverNext)}
            onMouseOut={() => handleMouseOut(setMouseOverNext)}
            onClick={() => handleNext(navigate, "/forms/create_players")}
          >
            Next
          </ThemedButton>
        </div>
      </form>
    </div>
  );
}

export default TeamForm;
