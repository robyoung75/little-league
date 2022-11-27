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
    adminCoachPost: "",
    player: "",
    posts: "",
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
    errors.email = "You have entered an invalid email address, please try again or contact your administrator";
  }

  if (err.message.includes("invalid password")) {
    errors.password = "You have entered an invalid password, please try again or contact your administrator";
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

  if (err.message.includes("No images are attached for upload, try again")) {
    errors.posts = err.message;
  }

  if (err.message.includes("No team posts were found")) {
    errors.posts = err.message;
  }

  if (err.message.includes("Please select and image or colors to update")) {
    errors.adminTeamPost = err.message;
  }

  if (
    err.message.includes(
      "The submitted email address exists for another user. Email must be unique"
    )
  ) {
    errors.adminCoachPost = err.message;
  }

  if (err.message.includes("Cannot read properties of null (reading 'save')")) {
    errors.user =
      "invalid user credentials please check user email and teamUserName";
  }

  console.log({ errors: errors });

  return errors;
};
