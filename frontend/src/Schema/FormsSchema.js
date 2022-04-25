import * as yup from "yup";

export const adminSchema = yup.object({
  firstName: yup.string().min(2).required(),
  lastName: yup.string().min(3).required(),
  email: yup.string().email().required(),
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

export const teamSchema = yup.object().shape({
  teamName: yup.string().required("Team name is required"),
});

export const signInSchema = yup.object().shape({
  userName: yup.string().required("user name is required"),
  userPassword: yup.string().required("user password is required")
})
