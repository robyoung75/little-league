import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminSchema } from "../../Schema/FormsSchema";
import "./Forms.css";
import { ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";
import { useNavigate } from "react-router-dom";
import {
  addSecondAdminUser,
  adminUserPost,
  authUserSignOut,
} from "../../assets/requests";

//  event handlers
import {
  handleMouseOver,
  handleMouseOut,
  handleNext,
  handleShowPassword,
} from "../../assets/eventHandlers";

function AdminForm({
  setNewAdminData,
  newAdminData,
  setSignedIn,
  setAuthenticated,
}) {
  const [{ authTheme, authUser }, dispatch] = useStateValue();
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

  const formSubmit = async (data) => {
    if (isSubmitSuccessful) {
      if (!authUser) {
        const response = await adminUserPost(data);
        localStorage.setItem("user", JSON.stringify(data));
        newAdminData ? setNewAdminData(false) : setNewAdminData(true);

        dispatch({
          type: "SET_AUTH_USER",
          authUser: response.data,
        });
        setSignedIn(true);
        setAuthenticated(true);
        reset();
      }

      if (authUser) {
        await addSecondAdminUser(authUser.teamId, data);
        localStorage.setItem("adminDataUser_2", JSON.stringify(data));
        reset();
      }
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
        <label htmlFor="teamName">Team name:</label>
        <input
          type="text"
          id="teamName"
          name="teamName"
          aria-describedby="teamName"
          {...register("teamName")}
        />
        {errors.teamName && (
          <span className="form__errors">{errors.teamName.message}</span>
        )}
        <label htmlFor="teamUserName">Team User name:</label>
        <input
          type="text"
          id="teamUserName"
          name="teamUserName"
          aria-describedby="teamUserName"
          {...register("teamUserName")}
        />
        {errors.teamUserName && (
          <span className="form__errors">{errors.teamUserName.message}</span>
        )}

        <label htmlFor="password">Password:</label>
        <input
          type={checked ? "text" : "password"}
          id="password"
          name="password"
          aria-describedby="userPassword"
          autoComplete="on"
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
          autoComplete="on"
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
