import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ImgFileInput from "./ImgFileInput";
import "./Forms.css";
import { imgURL } from "../../assets/functions";
import { playersSchema } from "../../Schema/FormsSchema";
import { ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";
import { useNavigate } from "react-router-dom";

import { adminPlayersPost, authUserGetPlayers } from "../../assets/requests";

//  eventHandlers
import {
  handleMouseOver,
  handleMouseOut,
  handleNext,
  handleImgPreview,
  handleImgCancel,
} from "../../assets/eventHandlers";

function PlayersForm({ newPlayersData, setNewPlayersData }) {
  const initialState = {
    firstName: "",
    lastName: "",
    number: "",
    images: [],
    headshotImg: "",
    offenseImg: "",
    defenseImg: "",
  };
  const [headshotPreview, setHeadshotPreview] = useState(null);
  const [offensePreview, setOffensePreview] = useState(null);
  const [defensePreview, setDefensePreview] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(initialState);

  const [mouseOver, setMouseOver] = useState(false);
  const [mouseOverHeadShot, setMouseOverHeadShot] = useState(false);
  const [mouseOverOffense, setMouseOverOffense] = useState(false);
  const [mouseOverDefense, setMouseOverDefense] = useState(false);
  const [mouseOverNext, setMouseOverNext] = useState(false);
  const [dataSubmit, setDataSubmit] = useState([]);

  const navigate = useNavigate();

  const [{ authTheme, authUser }, dispatch] = useStateValue();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(playersSchema) });

  const formSubmit = async (data) => {
    if (isSubmitSuccessful) {
      data.playerImg = playerInfo.headshotImg;
      data.playerOffenseImg = playerInfo.offenseImg;
      data.playerDefenseImg = playerInfo.defenseImg;
      data.images = playerInfo.images;

      console.log("playersFormSubmit_data", data);
      let formData = new FormData();
      formData.append("headshotImg", playerInfo.headshotImg);
      formData.append("offenseImg", playerInfo.offenseImg);
      formData.append("defenseImg", playerInfo.defenseImg);
      formData.append("images", playerInfo.images);
      formData.append("number", data.number);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("positions", data.positions);
      formData.append("battingStance", data.battingStance);
      formData.append("teamName", authUser.teamName);
      formData.append("teamUserName", authUser.teamUserName);

      await adminPlayersPost(formData);

      let dataArr = [];

      dataArr = JSON.parse(localStorage.getItem("playersData")) || [];
      let localData = {
        headshotImg: playerInfo.headshotImg
          ? URL.createObjectURL(playerInfo.headshotImg)
          : null,
        offenseImg: playerInfo.offenseImg
          ? URL.createObjectURL(playerInfo.offenseImg)
          : null,
        defenseImg: playerInfo.defenseImg
          ? URL.createObjectURL(playerInfo.defenseImg)
          : null,
        images: data.images,
        number: data.number,
        firstName: data.firstName,
        lastName: data.lastName,
        positions: data.positions,
        battingStance: data.battingStance,
      };

      dataArr.push(localData);

      localStorage.setItem("playersData", JSON.stringify(dataArr));

      console.log({ playersForm_formSubmit: dataArr });
      setDataSubmit((prevState) => [...prevState, data]);
      setPlayerInfo(initialState);

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

  const handlePlayers = (e) => {
    e.preventDefault();
    // setPlayers(prevState => ([...prevState, playerInfo]))
  };

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
          onChange={(e) =>
            setPlayerInfo((prevState) => ({
              ...prevState,
              firstName: e.target.value,
            }))
          }
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
          onChange={(e) =>
            setPlayerInfo((prevState) => ({
              ...prevState,
              lastName: e.target.value,
            }))
          }
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
          onChange={(e) =>
            setPlayerInfo((prevState) => ({
              ...prevState,
              number: e.target.value,
            }))
          }
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
          onChange={(e) => (
            handleImgPreview(e, setHeadshotPreview, imgURL),
            setPlayerInfo((prevState) => ({
              ...prevState,
              headshotImg: e.target.files[0],
              images: [...prevState.images, { headshot: e.target.files[0] }],
            }))
          )}
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
          onChange={(e) => (
            handleImgPreview(e, setOffensePreview, imgURL),
            setPlayerInfo((prevState) => ({
              ...prevState,
              offenseImg: e.target.files[0],
              images: [...prevState.images, { offenseImg: e.target.files[0] }],
            }))
          )}
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
          onChange={(e) => (
            handleImgPreview(e, setDefensePreview, imgURL),
            setPlayerInfo((prevState) => ({
              ...prevState,
              defenseImg: e.target.files[0],
              images: [...prevState.images, { defenseImg: e.target.files[0] }],
            }))
          )}
          onClick={(e) => handleImgCancel(e, setDefensePreview)}
          preview={defensePreview}
          alt="player defense"
          hovering={mouseOverDefense}
          onMouseOver={() => handleMouseOver(setMouseOverDefense)}
          onMouseOut={() => handleMouseOut(setMouseOverDefense)}
        />

        <div className="formPreview__btns">
          <ThemedButton
            theme={authTheme}
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
            theme={authTheme}
            hovering={mouseOverNext}
            onMouseOver={() => handleMouseOver(setMouseOverNext)}
            onMouseOut={() => handleMouseOut(setMouseOverNext)}
            onClick={async (e) => {
              e.preventDefault();
              // await adminPlayersPost(dataSubmit);
              handlePlayers(e);
              // handleNext(navigate, "/forms/create_coaches");
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
