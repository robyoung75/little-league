const handleMouseOver = (setStateFunc) => {
  setStateFunc(true);
};

const handleMouseOut = (setStateFunc) => {
  setStateFunc(false);
};

const handleNext = (navFunc, location) => {
  navFunc(location);
};

const handleShowPassword = (state, setStateFunc) => {
  state === true ? setStateFunc(false) : setStateFunc(true);
};

const handleColor = (e, setStateFunc) => {
  e.preventDefault();
  setStateFunc(e.target.value);
};

const handleImgPreview = (e, setStateFunc, imgURLFunc) => {
  e.preventDefault();
  console.log("handleImagePreview e", e.target.files[0]);
  const imgURL = imgURLFunc(e);
  console.log("imgURL", imgURL);
  setStateFunc(imgURL);
};

const handleImgCancel = (e, setStateFunc) => {
  e.preventDefault();
  setStateFunc(null);
};

const handleUserAuthentication = async (
  e,
  state,
  setStateFunc,
  submitFunction
) => {
  e.preventDefault();
  try {
    if (state) {
      setStateFunc(false);
      await submitFunction;
    }
    if (!state) {
      setStateFunc(true);
    }
  } catch (error) {
    console.log({ handleUserAuthentication: error });
  }
};

export {
  handleMouseOver,
  handleMouseOut,
  handleNext,
  handleShowPassword,
  handleColor,
  handleImgPreview,
  handleImgCancel,
  handleUserAuthentication
};
