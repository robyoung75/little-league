import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminSchema } from "../../Schema/FormsSchema";
import "./Forms.css";
import { ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";
import { useNavigate } from "react-router-dom";

//  event handlers
import {
  handleMouseOver,
  handleMouseOut,
  handleNext,
  handleShowPassword,
} from "../../assets/eventHandlers";

function AdminForm({ setNewAdminData, newAdminData }) {
  const [{ theme }] = useStateValue();
  const [checked, setChecked] = useState(false);
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseOverNext, setMouseOverNext] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(adminSchema) });

  const formSubmit = (data) => {
    if (isSubmitSuccessful) {
      localStorage.setItem("admin data", JSON.stringify(data));
      newAdminData ? setNewAdminData(false) : setNewAdminData(true);

      reset();
    }
  };

  return (
    <div className="adminForm form">
      <h3>Admin Form</h3>
      <form
        className="adminForm__form formContainer flexColumn"
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
        <label htmlFor="password">Password:</label>
        <input
          type={checked ? "text" : "password"}
          id="password"
          name="password"
          aria-describedby="userPassword"
          {...register("password")}
        />
        {errors.password && (
          <span className="form__errors">{errors.password.message}</span>
        )}
        <label htmlFor="confirmPassword">Confirm password:</label>
        <input
          type={checked ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          aria-describedby="userConfirmPassword"
          {...register("password_confirm")}
        />
        {errors.password_confirm && (
          <span className="form__errors">
            <p>{errors.password_confirm.message}</p>
          </span>
        )}
        <div className="checkbox">
          <label htmlFor={"showPassword"}>
            {checked ? "Hide password" : "Show password"}
          </label>
          <input
            type="checkbox"
            id="showPassword"
            name="showPassword"
            checked={checked}
            onChange={() => handleShowPassword(checked, setChecked)}
          />
        </div>
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
            onClick={() => handleNext(navigate, "/forms/create_teamName")}
          >
            Next
          </ThemedButton>
        </div>
      </form>
    </div>
  );
}

export default AdminForm;
