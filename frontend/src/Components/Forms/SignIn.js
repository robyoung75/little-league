import React from "react";
import { useStateValue } from "../../Context/stateProvider";
import { ThemedButton, ThemedHeader } from "../../utils/ThemedComponents";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../Schema/FormsSchema";
import "./Forms.css";
import { useNavigate } from "react-router-dom";

import { authUserSignInPost } from "../../assets/requests";

function SignIn({ setSignedIn }) {
  const [{ theme, userData }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(signInSchema) });

  const formSubmit = async (data) => {
    if (isSubmitSuccessful) {
      console.log({ formSubmit_signIn: data });
      const user = await authUserSignInPost(data);

      dispatch({
        type: "SET_USER",
        userData: user.data,
      });
      setSignedIn(true);
      reset();
      navigate("/social");
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
        <label htmlFor="userName">Username:</label>
        <input
          type="text"
          id="userName"
          name="userName"
          aria-describedby="userLastName"
          {...register("teamUserName")}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="userEmail"
          name="userEmail"
          aria-describedby="user email"
          {...register("email")}
        />

        <label htmlFor="userPassword">Password:</label>
        <input
          type="password"
          id="userPassword"
          name="userPassword"
          aria-describedby="userPassword"
          autoComplete="on"
          {...register("password")}
        />
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
