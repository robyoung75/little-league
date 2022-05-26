import Router, { application } from "express";

import {
  adminUser_post,
  createUser_post,
  signInUser_post,
  signOutUser_get,
} from "../controllers/authControllers.js";

import {
  authPlayers_post
} from '../controllers/playersControllers.js'

import {
  authTeam_post,
  
} from "../controllers/teamControllers.js";

import { cloudinaryUpload_post } from "../controllers/cloudinaryUpload.js";

import { requiresAuth } from "../middleware/authMiddleware.js";
import { multerUploads } from "../middleware/multer.js";

const router = Router();

router.post("/api/createAdminUser", adminUser_post);
router.post("/api/createUser", createUser_post);
router.post("/api/signin", signInUser_post);
router.get("/api/signout", signOutUser_get);
router.post("/api/admin/team", multerUploads, requiresAuth, authTeam_post);
router.post("/api/admin/createPlayers", requiresAuth, authPlayers_post);
router.post(
  "/api/admin/createPlayers/upload",
  multerUploads,
  cloudinaryUpload_post
);

export { router as authRoute };
