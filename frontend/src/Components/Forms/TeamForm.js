import React, { useState } from "react";
import "./Forms.css";
import ImgFileInput from "./ImgFileInput";
import { imgURL } from "../../assets/functions";
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
  const [primaryColor, setPrimaryColor] = useState(initialState.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(
    initialState.secondaryColor
  );
  const [logoPreview, setLogoPreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [{ theme }] = useStateValue();
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
      let formData = new FormData();
      formData.append("teamLogo", imgFile);
      formData.append("primaryColor", data.primaryColor);
      formData.append("secondaryColor", data.secondaryColor);
      await adminTeamPost(formData);
      // localStorage.clear();
      localStorage.setItem("team data", JSON.stringify(data));
      newTeamData ? setNewTeamData(false) : setNewTeamData(true);
      setLogoPreview(null);
      setImgFile(null);
      reset();
    }
  };

  return (
    <div className="teamForm form">
   
      <h3>Team Form: Team Name Here</h3>
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
            theme={theme}
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
            theme={theme}
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
