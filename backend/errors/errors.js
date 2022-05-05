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

  return errors;
};
