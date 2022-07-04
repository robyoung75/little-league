import Router, { application } from "express";

import {
  adminUser_post,
  signInUser_post,
  signOutUser_get,
} from "../controllers/authControllers.js";

import { authPlayers_post } from "../controllers/playersControllers.js";

import { authTeam_post } from "../controllers/teamControllers.js";

import { authCoaches_post } from "../controllers/coachesControllers.js";

import { authSchedule_post } from "../controllers/scheduleControllers.js";

import { cloudinaryUpload_post } from "../controllers/cloudinaryUpload.js";

import { requiresAuth } from "../middleware/authMiddleware.js";
import {
  multerUploads,
  multerUploadsMultiple,
  multerUploadsCoach,
} from "../middleware/multer.js";

const router = Router();

router.post("/api/createAdminUser", requiresAuth, adminUser_post);

router.post("/api/signin", signInUser_post);
router.get("/api/signout", signOutUser_get);
router.post("/api/admin/team", requiresAuth, multerUploads, authTeam_post);
router.post(
  "/api/admin/createPlayers",
  requiresAuth,
  multerUploadsMultiple,
  authPlayers_post
);
router.post(
  "/api/admin/createCoaches",
  requiresAuth,
  multerUploadsCoach,
  authCoaches_post
);
router.post("/api/admin/schedule", requiresAuth, authSchedule_post);

export { router as authRoute };
