export const handleErrors = (err) => {
  console.log({
    err: err,
    "err.code": err.code,
    "err.message": err.message,
  });

  let errors = {
    email: "",
    password: "",
    user: "",
    adminUser: "",
    adminTeamPost: "",
    player: "",
  };

  // validation errors from UserSchema validators
  if (
    err.message.includes("team validation failed:") ||
    err.message.includes("admin validation failed:")
  ) {
    console.log("ERR.ERRORS>>>>>>>>>>>", err.errors);
    console.log("OBJECT VALUES", Object.values(err.errors));
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.code === 11000) {
    errors.user = `${err.keyValue.email} already exists, user must be unique.`;
  }

  if (err.message === "you must be signed in and authorized to proceed") {
    errors.adminTeamPost = err.message;
  }

  if (
    err.message.includes(
      "you have exceeded the maximum allowed of two admin users"
    )
  ) {
    errors.adminUser = err.message;
  }

  if (err.message.includes("A team with this id already exists")) {
    errors.adminTeamPost = err.message;
  }

  if (err.message.includes("signin failed check credentials")) {
    errors.adminUser = err.message;
  }

  if (err.message.includes("invalid email")) {
    errors.email = err.message;
  }

  if (err.message.includes("invalid password")) {
    errors.password = err.message;
  }

  if (
    err.message.includes(
      "Authorization denied, no existing team found check credentials"
    )
  ) {
    errors.user = err.message;
  }

  if (err.message.includes("A user with this email already exists")) {
    errors.user = err.message;
  }

  if (err.message.includes("A player with this number already exists")) {
    errors.player = err.message;
  }

  if (
    err.message.includes("You only have one admin user that cannot be deleted.")
  ) {
    errors.adminUser = err.message;
  }

 

  console.log({ errors: errors });

  return errors;
};
