import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ImgFileInput from "./ImgFileInput";
import "./Forms.css";
import { imgURL } from "../../assets/functions";
import { playersSchema } from "../../Schema/FormsSchema";
import { ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";
import { useNavigate } from "react-router-dom";

import { adminPlayersPost } from "../../assets/requests";

//  eventHandlers
import {
  handleMouseOver,
  handleMouseOut,
  handleNext,
  handleImgPreview,
  handleImgCancel,
} from "../../assets/eventHandlers";

function PlayersForm({ newPlayersData, setNewPlayersData }) {
  const [headshotPreview, setHeadshotPreview] = useState(null);
  const [offensePreview, setOffensePreview] = useState(null);
  const [defensePreview, setDefensePreview] = useState(null);
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseOverHeadShot, setMouseOverHeadShot] = useState(false);
  const [mouseOverOffense, setMouseOverOffense] = useState(false);
  const [mouseOverDefense, setMouseOverDefense] = useState(false);
  const [mouseOverNext, setMouseOverNext] = useState(false);
  const [dataSubmit, setDataSubmit] = useState([]);
  const navigate = useNavigate();
  const [{ theme }] = useStateValue();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(playersSchema) });

  const formSubmit = (data) => {
    if (isSubmitSuccessful) {
      let dataArr = [];

      data.playerImg = headshotPreview;
      data.playerOffenseImg = offensePreview;
      data.playerDefenseImg = defensePreview;
      
      dataArr = JSON.parse(localStorage.getItem("players data")) || [];
      dataArr.push(data);

      localStorage.setItem("players data", JSON.stringify(dataArr));
      console.log({playersForm_formSubmit: dataArr});
      setDataSubmit(dataSubmit.concat(data));

      newPlayersData ? setNewPlayersData(false) : setNewPlayersData(true);
      setHeadshotPreview(null);
      setOffensePreview(null);
      setDefensePreview(null);
      window.scroll(0, 0);
      reset();
    }
  };

  const positions = [
    "Pitcher",
    "Catcher",
    "1B",
    "2B",
    "SS",
    "3B",
    "RF",
    "CF",
    "LF",
  ];

  return (
    <div className="playersForm form">
      <h3>Players Form</h3>
      <form
        className="playersForm__form formContainer flexColumn"
        onSubmit={handleSubmit(formSubmit)}
      >
        <label htmlFor="playerFirstName">First name:</label>
        <input
          type="text"
          id="playerFirstName"
          name="playerFirstName"
          aria-describedby="players first name"
          {...register("firstName")}
        />
        {errors.firstName && (
          <span className="form__errors">{errors.firstName.message}</span>
        )}
        <label htmlFor="playerLastName">Last name:</label>
        <input
          type="text"
          id="playerLastName"
          name="playerLastName"
          aria-describedby="players last name"
          {...register("lastName")}
        />
        {errors.lastName && (
          <span className="form__errors">{errors.lastName.message}</span>
        )}
        <label htmlFor="playerNumber">Number:</label>
        <input
          type="text"
          id="playerNumber"
          name="playerNumber"
          aria-describedby="players number"
          {...register("number")}
        />
        {errors.number && (
          <span className="form__errors">Valid number is required</span>
        )}
        <div className="formContainer flexColumn">
          <label>Player positions, select all that apply</label>
          {positions.map((position) => (
            <div key={position} className="playersForm__checkBoxContainer">
              <input
                type="checkbox"
                id={position}
                name={position}
                value={position}
                aria-describedby="players positions"
                {...register("positions")}
              />
              <label htmlFor={position}>{position}</label>
            </div>
          ))}
          {errors.positions && (
            <span className="form__errors">Select at least one position</span>
          )}
        </div>

        <div className="formContainer flexColumn">
          <label>Batting stance select all that apply</label>
          <div className="playersForm__checkBoxContainer">
            <input
              type="checkbox"
              id="batsRH"
              name="batsRH"
              value="RH"
              aria-describedby="players batting stance"
              {...register("battingStance")}
            />
            <label htmlFor="batsRH">RH</label>
          </div>
          <div className="playersForm__checkBoxContainer">
            <input
              type="checkbox"
              id="batsLH"
              name="batsLH"
              value="LH"
              aria-describedby="players batting stance"
              {...register("battingStance")}
            />
            <label htmlFor="batsLH">LH</label>
          </div>

          {errors.battingStance && (
            <span className="form__errors">
              Select at least one batting stance
            </span>
          )}
        </div>

        <ImgFileInput
          id="playerImg"
          className="imageUploadContainer"
          name="playerImg"
          htmlFor={"playerImg"}
          title="Select player headshot image"
          onChange={(e) => handleImgPreview(e, setHeadshotPreview, imgURL)}
          onClick={(e) => handleImgCancel(e, setHeadshotPreview)}
          preview={headshotPreview}
          alt="player"
          hovering={mouseOverHeadShot}
          onMouseOver={() => handleMouseOver(setMouseOverHeadShot)}
          onMouseOut={() => handleMouseOut(setMouseOverHeadShot)}
        />
        <ImgFileInput
          id="playerOffenseImg"
          className="imageUploadContainer"
          name="playerOffenseImg"
          htmlFor="playerOffenseImg"
          title="Select player offense image"
          onChange={(e) => handleImgPreview(e, setOffensePreview, imgURL)}
          onClick={(e) => handleImgCancel(e, setOffensePreview)}
          preview={offensePreview}
          alt="player offense"
          hovering={mouseOverOffense}
          onMouseOver={() => handleMouseOver(setMouseOverOffense)}
          onMouseOut={() => handleMouseOut(setMouseOverOffense)}
        />
        <ImgFileInput
          id="playerDefenseImg"
          className="imageUploadContainer"
          name="playerDefenseImg"
          htmlFor="playerDefenseImg"
          title="Select player defense image"
          onChange={(e) => handleImgPreview(e, setDefensePreview, imgURL)}
          onClick={(e) => handleImgCancel(e, setDefensePreview)}
          preview={defensePreview}
          alt="player defense"
          hovering={mouseOverDefense}
          onMouseOver={() => handleMouseOver(setMouseOverDefense)}
          onMouseOut={() => handleMouseOut(setMouseOverDefense)}
        />

        <div className="formPreview__btns">
          <ThemedButton
            theme={theme}
            hovering={mouseOver}
            onMouseOver={() => handleMouseOver(setMouseOver)}
            onMouseOut={() => handleMouseOut(setMouseOver)}
            type="submit"
          >
            {localStorage.getItem("players data")
              ? "Submit Next Player"
              : "Submit Player"}
          </ThemedButton>
        </div>

        <div className="formPreview__btns">
          <ThemedButton
            theme={theme}
            hovering={mouseOverNext}
            onMouseOver={() => handleMouseOver(setMouseOverNext)}
            onMouseOut={() => handleMouseOut(setMouseOverNext)}
            onClick={async (e) => {
              e.preventDefault();
              await adminPlayersPost(dataSubmit);
              handleNext(navigate, "/forms/create_coaches");
            }}
          >
            Next
          </ThemedButton>
        </div>
      </form>
    </div>
  );
}

export default PlayersForm;
