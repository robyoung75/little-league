import Router, { application } from "express";

import {
  adminUser_post,
  allAdminUsers_get,
  signInAdminUser_post,
  signOutUser_get,
} from "../controllers/authControllers.js";

import {
  authPlayers_post,
  players_get,
} from "../controllers/playersControllers.js";

import { authTeam_post, team_get } from "../controllers/teamControllers.js";

import { authCoaches_post } from "../controllers/coachesControllers.js";

import { authSchedule_post } from "../controllers/scheduleControllers.js";

import {
  authNewUser_post,
  userCreateUser_post,
  signInUser_post,
} from "../controllers/userControllers.js";

import { cloudinaryUpload_post } from "../controllers/cloudinaryUpload.js";

import { requiresAuth } from "../middleware/authMiddleware.js";
import {
  multerUploadsTeam,
  multerUploadsMultiple,
  multerUploadsCoach,
} from "../middleware/multer.js";

const router = Router();

router.post("/api/userCreateUser", userCreateUser_post);

router.post("/api/createAdminUser", requiresAuth, adminUser_post);
router.get("/api/admin/adminUsers", requiresAuth, allAdminUsers_get);

router.post("/api/admin/signin", signInAdminUser_post);
router.post("/api/user/signin", signInUser_post);
router.get("/api/signout", signOutUser_get);

router.post("/api/admin/team", requiresAuth, multerUploadsTeam, authTeam_post);
router.get("/api/admin/team", requiresAuth, team_get);

router.post(
  "/api/admin/createPlayers",
  requiresAuth,
  multerUploadsMultiple,
  authPlayers_post
);
router.get("/api/admin/players", requiresAuth, players_get);

router.post(
  "/api/admin/createCoaches",
  requiresAuth,
  multerUploadsCoach,
  authCoaches_post
);
router.post("/api/admin/schedule", requiresAuth, authSchedule_post);

router.post("/api/admin/createUser", requiresAuth, authNewUser_post);

export { router as authRoute };
