import React, { useState } from "react";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedButton, ThemedHeader } from "../../utils/ThemedComponents";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema, userSchema } from "../../Schema/FormsSchema";
import "./Forms.css";
import { useNavigate } from "react-router-dom";

import {
  adminUserSignIn,
  userCreateAccount,
  userSignIn,
} from "../../assets/requests";

import { handleShowPassword } from "../../assets/eventHandlers";

function SignIn({ setSignedIn, setAuthenticated }) {
  const [{ authTheme }, dispatch] = useStateValue();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  const [schema, setSchema] = useState(signInSchema);
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  const handleCreateAccount = (e) => {
    e.preventDefault();
    console.log("handleCreateAccount");

    const user = userSchema;
    const signIn = signInSchema;

    if (createAccount === false) {
      setCreateAccount(true);
      setSchema(user);
    }

    if (createAccount === true) {
      setCreateAccount(false);
      setSchema(signIn);
    }
  };

  const handleSetAdminUser = (e) => {
    const checked = e.target.checked;
    const checkedValue = e.target.value;
    const checkedName = e.target.name;

    if (!isAdmin) {
      setIsAdmin(true);
      console.log("isAdmin set to true");
    }

    if (isAdmin) {
      setIsAdmin(false);
      console.log("isAdmin is set to false");
    }

    console.log({ checked, checkedValue, checkedName, isAdmin });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(schema) });

  const formSubmit = async (data) => {
    dispatch({
      type: "SET_ERRORS",
      errors: null,
    });
    if (isSubmitSuccessful) {
      console.log({ formSubmit_signIn: data });
      let response;

      if (createAccount && schema === userSchema) {
        response = await userCreateAccount(data);
      }

      if (isAdmin) {
        response = await adminUserSignIn(data);
        response.data.adminAuth = true;
      }

      if (!isAdmin) {
        response = await userSignIn(data);
        response.adminAuth = false;
      }

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));

        dispatch({
          type: "SET_AUTH_USER",
          authUser: response.data,
        });

        setSignedIn(true);
        setAuthenticated(true);

        reset();
        navigate("/social");
      } else {
        dispatch({
          type: "SET_ERRORS",
          errors: response,
        });
        reset();
      }
    }
  };

  return (
    <div className="signIn">
      <ThemedHeader theme={authTheme} className="signIn__header">
        {createAccount ? "Create New User" : "Sign in"}
      </ThemedHeader>
      <form
        className="signIn__form formContainer flexColumn"
        onSubmit={handleSubmit(formSubmit)}
      >
        <label htmlFor="teamUserName">Team Username:</label>
        <input
          type="text"
          id="teamUserName"
          name="teamUserName"
          aria-describedby="team user name"
          {...register("teamUserName")}
        />
        {errors.teamUserName && (
          <span className="form__errors">{errors.teamUserName.message}</span>
        )}
        {createAccount ? (
          <>
            <label htmlFor="firstName">New User First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              aria-describedby="first name"
              autoComplete="on"
              {...register("firstName")}
            />
            {errors.firstName && (
              <span className="form__errors">{errors.firstName.message}</span>
            )}
            <label htmlFor="lastName">New User Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastname"
              aria-describedby="last name"
              autoComplete="on"
              {...register("lastName")}
            />
            {errors.lastName && (
              <span className="form__errors">{errors.lastName.message}</span>
            )}
            <label htmlFor="playerFirtName">Your Players First Name:</label>
            <input
              type="text"
              id="playerFirstName"
              name="playerFirstName"
              aria-describedby="players first name"
              autoComplete="on"
              {...register("playerFirstName")}
            />
            {errors.playerFirstName && (
              <span className="form__errors">
                {errors.playerFirstName.message}
              </span>
            )}

            <label htmlFor="playerLastName">Your Players Last Name:</label>
            <input
              type="text"
              id="playersLastName"
              name="playersLastName"
              aria-describedby="players last name"
              autoComplete="on"
              {...register("playerLastName")}
            />
            {errors.userLastName && (
              <span className="form__errors">
                {errors.userLastName.message}
              </span>
            )}
          </>
        ) : null}

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="userEmail"
          name="userEmail"
          aria-describedby="user email"
          {...register("email")}
        />
        {errors.email && (
          <span className="form__errors">{errors.email.message}</span>
        )}
        <label htmlFor="userPassword">Password:</label>
        <input
          type={checked ? "text" : "password"}
          id="userPassword"
          name="userPassword"
          aria-describedby="userPassword"
          autoComplete="on"
          {...register("password")}
        />
        {errors.password && (
          <span className="form__errors">{errors.password.message}</span>
        )}

        {createAccount ? (
          <>
            <label htmlFor="confirmPassword">Confirm password: </label>
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
          </>
        ) : null}

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
        {!createAccount ? (
          <label htmlFor="admin" className="signIn__adminLabel">
            Admin:
            <input
              type="checkbox"
              id="admin"
              name="admin"
              value={isAdmin}
              onChange={handleSetAdminUser}
            />
          </label>
        ) : null}

        <div className="formPreview__btns signIn__btn">
          <ThemedButton theme={authTheme} type="submit" className="smallBTN">
            Sign in
          </ThemedButton>
          <ThemedButton
            theme={authTheme}
            onClick={handleCreateAccount}
            className="smallBTN"
          >
            Create New User
          </ThemedButton>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
