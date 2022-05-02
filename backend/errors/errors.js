export const handleErrors = (err) => {
  console.log({
    "err.code": err.code,
    "error.message": err.message,
  });

  let errors = {
    email: "",
    password: "",
  };

  if (err.message.includes("admin validation failed")) {
    console.log("err.errors >>>>>", err.errors);
    console.log("err Object Values >>>>>", Object.values(err.errors));
    Object.values(err.errors).forEach((properties) => {
      errors[properties.path] = properties.message;
    });
  }

  return err.errors;
};
