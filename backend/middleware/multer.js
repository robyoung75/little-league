import multer from "multer";

const storage = multer.memoryStorage();

const multerUploadsTeam = multer({ storage }).single("teamLogo");

const multerUploadsCoach = multer({ storage }).single("headshotImg");

const multerUploadsMultiple = multer({ storage }).fields([
  { name: "headshotImg", maxCount: 1 },
  { name: "offenseImg", maxCount: 1 },
  { name: "defenseImg", maxCount: 1 },
]);

// const multerUploadsPosts = multer({ storage }).fields([
//   { name: "postImages", maxCount: 5 },
  
// ]);

const multerUploadsPosts = multer({storage}).array('postImages', 5)

// const multerUploadsMultiple = multer({ storage }).array('images');
export {
  multerUploadsTeam,
  multerUploadsMultiple,
  multerUploadsCoach,
  multerUploadsPosts,
};
