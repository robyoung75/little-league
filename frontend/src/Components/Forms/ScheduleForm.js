import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./Forms.css";
import { scheduleSchema } from "../../Schema/FormsSchema";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedButton } from "../../utils/ThemedComponents";
import { useNavigate } from "react-router-dom";

//  eventHandlers
import {
  handleMouseOver,
  handleMouseOut,
  handleNext,
} from "../../assets/eventHandlers";

function ScheduleForm({ newScheduleData, setNewScheduleData }) {
  const [{ theme }] = useStateValue();
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseOverNext, setMouseOverNext] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(scheduleSchema) });

  const formSubmit = (data) => {
    if (isSubmitSuccessful) {
      let dataArr = [];
      dataArr = JSON.parse(localStorage.getItem("schedule data")) || [];
      dataArr.push(data);

      localStorage.setItem("schedule data", JSON.stringify(dataArr));

      newScheduleData ? setNewScheduleData(false) : setNewScheduleData(true);
      window.scroll(0, 0)

      reset();
    }
  };

  return (
    <div className="scheduleForm form flexColumn">
      <h3>Schedule Form</h3>
      <form
        className="formContainer flexColumn"
        onSubmit={handleSubmit(formSubmit)}
      >
        <label htmlFor="opponent">Opponent:</label>
        <input
          type="text"
          id="opponent"
          name="opponent"
          aria-describedby="opponent"
          {...register("opponent")}
        />
        {errors.opponent && (
          <span className="form__errors">{errors.opponent.message}</span>
        )}
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          aria-describedby="date"
          {...register("date")}
        />
        {errors.date && (
          <span className="form__errors">
            A valid date mm/dd/yyyy is required
          </span>
        )}
        <label htmlFor="gameTime">GameTime:</label>
        <input
          type="time"
          id="gameTime"
          name="gameTime"
          aria-describedby="game time"
          {...register("gameTime")}
        />
        {errors.gameTime && (
          <span className="form__errors">{errors.gameTime.message}</span>
        )}
        <label htmlFor="arrivalTime">Arrival time:</label>
        <input
          type="time"
          id="arrivalTime"
          name="arrivalTime"
          aria-describedby="user arrival time"
          {...register("arrivalTime")}
        />
        {errors.arrivalTime && (
          <span className="form__errors">{errors.arrivalTime.message}</span>
        )}
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          aria-describedby="game address"
          {...register("address")}
        />
        {errors.address && (
          <span className="form__errors">{errors.address.message}</span>
        )}
        <label htmlFor="city">City:</label>
        <input
          type="text"
          id="city"
          name="city"
          aria-describedby="game city"
          {...register("city")}
        />
        {errors.city && (
          <span className="form__errors">{errors.city.message}</span>
        )}
        <label htmlFor="state">State:</label>
        <input
          type="text"
          id="state"
          name="state"
          aria-describedby="game state"
          {...register("state")}
        />
        {errors.state && (
          <span className="form__errors">{errors.state.message}</span>
        )}
        <label htmlFor="zipCode">Zip code:</label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          aria-describedby="zip code"
          {...register("zipCode")}
        />
        {errors.zipCode && (
          <span className="form__errors">
            A valid numerical zipcode is required
          </span>
        )}
        <label htmlFor="homeAway">Home team or away:</label>
        <input
          type="text"
          id="homeAway"
          name="homeAway"
          aria-describedby="home or away team"
          {...register("homeAway")}
        />
        {errors.homeAway && (
          <span className="form__errors">{errors.homeAway.message}</span>
        )}
        <label htmlFor="uniform">Uniform color:</label>
        <input
          type="text"
          id="uniform"
          name="uniform"
          aria-describedby="uniform color"
          {...register("uniform")}
        />
        {errors.uniform && (
          <span className="form__errors">{errors.uniform.message}</span>
        )}

        <div className="formPreview__btns">
          <ThemedButton
            theme={theme}
            hovering={mouseOver}
            onMouseOver={() => handleMouseOver(setMouseOver)}
            onMouseOut={() => handleMouseOut(setMouseOver)}
            type="submit"
          >
            {localStorage.getItem("schedule data")
              ? "Submit Next Game"
              : "Submit"}
          </ThemedButton>
        </div>

        <div className="formPreview__btns">
          <ThemedButton
            theme={theme}
            hovering={mouseOverNext}
            onMouseOver={() => handleMouseOver(setMouseOverNext)}
            onMouseOut={() => handleMouseOut(setMouseOverNext)}
            onClick={() => handleNext(navigate, "/forms/completed_form")}
          >
            Next
          </ThemedButton>
        </div>
      </form>
    </div>
  );
}

export default ScheduleForm;
