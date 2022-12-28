import * as yup from "yup";

export const adminSchema = yup.object({
  firstName: yup.string().min(2).required(),
  lastName: yup.string().min(3).required(),
  email: yup.string().email().required(),
  teamName: yup
    .string()
    .min(3)
    .required("please enter a minimum of three characters for team name"),
  teamUserName: yup
    .string()
    .min(6)
    .required(
      "please enter a minimum of six characters for the team user name"
    ),
  password: yup.string().min(6).required(),
  password_confirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "passwords must match")
    .required("please confirm your password"),
});

export const coachesSchema = yup.object({
  firstName: yup.string().min(2).required(),
  lastName: yup.string().min(3).required(),
  email: yup.string().email().required(),
});

export const playersSchema = yup.object({
  firstName: yup.string().min(2).required(),
  lastName: yup.string().min(3).required(),
  number: yup.number().required(),
  positions: yup.array().required(),
  battingStance: yup.array().required(),
});

export const scheduleSchema = yup.object({
  opponent: yup.string().required("Opponent is required"),
  date: yup.date().required("Valid date mm/dd/yyyy is required"),
  gameTime: yup.string().required("Valid game time is required hh:mm am/pm"),
  arrivalTime: yup
    .string()
    .required("Valid arrival time is required hh:mm am/pm"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zipCode: yup.number(),
  homeAway: yup.string().required("Home or away is required"),
  uniform: yup.string(),
});

export const teamSchema = yup.object().shape({});

export const signInSchema = yup.object().shape({
  teamUserName: yup.string().required("Please enter a valid teamUserName"),
  email: yup.string().email().required("Please enter a valid email"),
  password: yup.string().required("Please enter a valid password"),

});

export const postSchema = yup.object().shape({});

export const userSchema = yup.object().shape({
  firstName: yup.string().min(2).required(),
  lastName: yup.string().min(3).required(),
  playerFirstName: yup.string().min(2).required(),
  playerLastName: yup.string().min(3).required(),
  teamUserName: yup.string().required("Please enter a valid teamUserName"),
  email: yup.string().email().required("Please enter a valid email"),
  password: yup.string().min(6).required(),
  password_confirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "passwords must match")
    .required("please confirm your password"),
});
