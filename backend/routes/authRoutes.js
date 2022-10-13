import Router, { application } from "express";

import {
  adminUser_post,
  allAdminUsers_get,
  adminUserUpdateRemoveUser_delete,
  signInAdminUser_post,
  signOutUser_get,
} from "../controllers/authControllers.js";

import {
  authPlayers_post,
  players_get,
  updatePlayerData_put,
} from "../controllers/playersControllers.js";

import {
  authTeam_post,
  team_get,
  teamUdpdate_put,
} from "../controllers/teamControllers.js";

import {
  authCoaches_post,
  coaches_get,
  updateCoachData_put,
} from "../controllers/coachesControllers.js";

import {
  authSchedule_post,
  schedule_get,
} from "../controllers/scheduleControllers.js";

import {
  authNewUser_post,
  userCreateUser_post,
  signInUser_post,
} from "../controllers/userControllers.js";

import {
  requiresAuth,
  getTeamByTeamId,
  getPlayerById,
} from "../middleware/authMiddleware.js";
import {
  multerUploadsTeam,
  multerUploadsMultiple,
  multerUploadsCoach,
} from "../middleware/multer.js";

const router = Router();

//  PARAM MIDDLEWARE WILL RUN ANY TIME THE PARAMETER IS TEAMID and set req.userTeamId to the teamId parameter
router.param("teamId", getTeamByTeamId);
router.param("playerId", getPlayerById);

// ADMIN ROUTES
router.post("/api/createAdminUser", requiresAuth, adminUser_post);
router.get("/api/admin/adminUsers", requiresAuth, allAdminUsers_get);
router.post("/api/admin/createUser", requiresAuth, authNewUser_post);
router.delete(
  "/api/admin/updateRemoveAdminUser/:userId/:email/:firstName/:lastName",
  requiresAuth,
  adminUserUpdateRemoveUser_delete
);

// ADMIN USER AND USER SIGN IN SIGNOUT ROUTES
router.post("/api/admin/signin", signInAdminUser_post);
router.post("/api/user/signin", signInUser_post);
router.get("/api/signout", signOutUser_get);

// TEAM ROUTES
router.post("/api/admin/team", requiresAuth, multerUploadsTeam, authTeam_post);
router.get("/api/admin/team/:teamId", requiresAuth, team_get);
router.put(
  "/api/admin/team/updateImage/:teamId",
  requiresAuth,
  multerUploadsTeam,
  teamUdpdate_put
);

// PLAYER ROUTES
router.post(
  "/api/admin/createPlayers",
  requiresAuth,
  multerUploadsMultiple,
  authPlayers_post
);

router.get("/api/admin/players/:teamId", requiresAuth, players_get);
router.put(
  "/api/admin/players/updatePlayer",
  requiresAuth,
  multerUploadsMultiple,
  updatePlayerData_put
);

// COACHES ROUTES
router.post(
  "/api/admin/coaches/createCoach",
  requiresAuth,
  multerUploadsCoach,
  authCoaches_post
);
router.get("/api/admin/coaches/:teamId", coaches_get);
router.put(
  "/api/admin/coaches/updateCoach",
  requiresAuth,
  multerUploadsCoach,
  updateCoachData_put
);

// SCHEDULE ROUTES
router.post("/api/admin/schedule", requiresAuth, authSchedule_post);
router.get("/api/admin/schedule/:teamId", requiresAuth, schedule_get);

// USER ROUTES
router.post("/api/userCreateUser", userCreateUser_post);

export { router as authRoute };
