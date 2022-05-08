import Router from "express";

import {
  adminUser_post,
  createUser_post,
  signInUser_post,
  signOutUser_get,
} from "../controllers/authControllers.js";
import {
  authTeam_post,
  authPlayers_post,
} from "../controllers/teamControllers.js";

import { requiresAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/api/createAdminUser", adminUser_post);
router.post("/api/createUser", createUser_post);
router.post("/api/signin", signInUser_post);
router.get("/api/signout", signOutUser_get);
router.post("/api/admin/team", requiresAuth, authTeam_post);
router.post("/api/admin/createPlayers", requiresAuth, authPlayers_post);

export { router as authRoute };
