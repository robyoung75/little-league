import multer from "multer";
import datauri from "datauri";
import path from "path";

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("teamLogo");

export { multerUploads };
