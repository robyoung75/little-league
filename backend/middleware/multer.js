import multer from "multer";

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("teamLogo");

const multerUploadsMultiple = multer({ storage }).fields([
  { name: "headshotImg", maxCount: 1 },
  { name: "offenseImg", maxCount: 1 },
  { name: "defenseImg", maxCount: 1 },
]);

// const multerUploadsMultiple = multer({ storage }).array('images');
export { multerUploads, multerUploadsMultiple };
