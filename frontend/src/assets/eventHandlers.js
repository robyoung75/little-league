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
  const imgURL = imgURLFunc(e);
  setStateFunc(imgURL);
};

const handleImgCancel = (e, setStateFunc) => {
  e.preventDefault();
  setStateFunc(null);
};

export {
  handleMouseOver,
  handleMouseOut,
  handleNext,
  handleShowPassword,
  handleColor,
  handleImgPreview,
  handleImgCancel,
};
