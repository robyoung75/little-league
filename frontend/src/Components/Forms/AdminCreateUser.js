import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { handleShowPassword } from "../../assets/eventHandlers";
import { userSchema } from "../../Schema/FormsSchema";
import { ThemedButton } from "../../utils/ThemedComponents";
import { useStateValue } from "../../Context/stateProvider";
import { adminCreateNewUser } from "../../assets/requests";

function AdminCreateUser() {
  const [checked, setChecked] = useState(false);
  const [teamUserName, setTeamUserName] = useState("fluffAndPuff");

  const [{ authTheme, authUser }, dispatch] = useStateValue();

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(userSchema) });

  const formSubmit = async (data) => {
    if (isSubmitSuccessful) {
      console.log("adminCreateUser__formSubmit >>>>> ", data);

      await adminCreateNewUser(data);

      reset();
    }
  };

  return (
    <div className="usersForm form">
      <h3>Users Form</h3>
      <form
        className="usersForm__form formContainer flexColumn"
        onSubmit={handleSubmit(formSubmit)}
      >
        <input
          type={"hidden"}
          id={"teamUserName"}
          name="teamUserName"
          aria-describedby="teams user name"
          {...register(
            "teamUserName",
            setValue("teamUserName", authUser ? authUser.teamUserName : null)
          )}
        />
        {errors.teamUserName && (
          <span className="form__errors">{errors.teamUserName.message}</span>
        )}

        <label htmlFor="firstName">First name:</label>
        <input
          type={"text"}
          id={"userFirstName"}
          name="userFirstName"
          aria-describedby="new users first name"
          {...register("firstName")}
        />
        {errors.firstName && (
          <span className="form__errors">{errors.firstName.message}</span>
        )}
        <label htmlFor="lastName">Last name:</label>
        <input
          type={"text"}
          id={"userLastName"}
          name="userLastName"
          aria-describedby="new users last name"
          {...register("lastName")}
        />
        {errors.lastName && (
          <span className="form__errors">{errors.lastName.message}</span>
        )}
        <label htmlFor="playerFirstName">Player first name:</label>
        <input
          type={"text"}
          id={"playerFirstName"}
          name="playerFirstName"
          aria-describedby="new users players first name"
          {...register("playerFirstName")}
        />
        {errors.playerFirstName && (
          <span className="form__errors">{errors.playerFirstName.message}</span>
        )}
        <label htmlFor="playerLastName">Player last name:</label>
        <input
          type={"text"}
          id={"playerLastName"}
          name="playerLastName"
          aria-describedby="new users players last name"
          {...register("playerLastName")}
        />
        {errors.playerLastName && (
          <span className="form__errors">{errors.playerLastName.message}</span>
        )}
        <label htmlFor="newUserEmail">Email</label>
        <input
          type={"email"}
          id="newUserEmail"
          name="newUserEmail"
          aria-describedby="new user email address"
          {...register("email")}
        />
        {errors.email && (
          <span className="form__errors">{errors.email.message}</span>
        )}
        <label htmlFor="newUserPassword">Password</label>
        <input
          type={checked ? "text" : "password"}
          id="newUserPassword"
          name="newUserPassword"
          aria-describedby="new user password"
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
            {errors.password_confirm.message}
          </span>
        )}
        <label htmlFor="showPassword" className="signIn__adminLabel">
          {checked ? "Hide password" : "Show password"}

          <input
            type="checkbox"
            id="showPassword"
            name="showPassword"
            checked={checked}
            value={checked}
            onChange={() => handleShowPassword(checked, setChecked)}
          />
        </label>

        <div className="formPreview__btns">
          <ThemedButton theme={authTheme} type="submit">
            Submit
          </ThemedButton>
        </div>
        <div className="formPreview__btns">
          <ThemedButton theme={authTheme}>Next</ThemedButton>
        </div>
      </form>
    </div>
  );
}

export default AdminCreateUser;
