import React, { useState } from "react";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedButton, ThemedHeader } from "../../utils/ThemedComponents";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../Schema/FormsSchema";
import "./Forms.css";
import { useNavigate } from "react-router-dom";

import { adminUserSignIn, userSignIn } from "../../assets/requests";

function SignIn({ setSignedIn, setAuthenticated }) {
  const [{ theme, userData }, dispatch] = useStateValue();
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

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
  } = useForm({ resolver: yupResolver(signInSchema) });

  const formSubmit = async (data) => {
    dispatch({
      type: "SET_ERRORS",
      errors: null,
    });
    if (isSubmitSuccessful) {
      console.log({ formSubmit_signIn: data });
      let response;

      if (isAdmin) {
        response = await adminUserSignIn(data);
      }

      if (!isAdmin) {
        response = await userSignIn(data);
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
      <ThemedHeader theme={theme} className="signIn__header">
        Sign in
      </ThemedHeader>
      <form
        className="signIn__form formContainer flexColumn"
        onSubmit={handleSubmit(formSubmit)}
      >
        <label htmlFor="userName">Team Username:</label>
        <input
          type="text"
          id="userName"
          name="userName"
          aria-describedby="userLastName"
          {...register("teamUserName")}
        />
        {errors.teamUserName && (
          <span className="form__errors">{errors.teamUserName.message}</span>
        )}
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
          type="password"
          id="userPassword"
          name="userPassword"
          aria-describedby="userPassword"
          autoComplete="on"
          {...register("password")}
        />
        {errors.password && (
          <span className="form__errors">{errors.password.message}</span>
        )}
        <label
          htmlFor="admin"
          className="signIn__adminLabel"
          onChange={handleSetAdminUser}
        >
          Admin:
          <input type="checkbox" id="admin" name="admin" value={isAdmin} />
        </label>

        <div className="formPreview__btns signIn__btn">
          <ThemedButton theme={theme} type="submit">
            Submit
          </ThemedButton>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
