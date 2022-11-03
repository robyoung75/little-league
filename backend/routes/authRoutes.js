import Router, { application } from "express";

import {
  createAdminUser_post,
  getAllAdminUsers_get,
  deleteAdminUser_delete,
  signInAdminUser_post,
  signOutUser_get,
  updateAdminUsers_put,
} from "../controllers/authControllers.js";

import {
  authPlayers_post,
  deletePlayer_delete,
  players_get,
  updatePlayerData_put,
} from "../controllers/playersControllers.js";

import {
  createTeam_post,
  team_get,
  teamUdpdate_put,
} from "../controllers/teamControllers.js";

import {
  authCoaches_post,
  coaches_get,
  deleteCoach_delete,
  updateCoachData_put,
} from "../controllers/coachesControllers.js";

import {
  authSchedule_post,
  deleteScheduleDate_delete,
  schedule_get,
  updateSchedule_put,
} from "../controllers/scheduleControllers.js";

import {
  authNewUser_post,
  userCreateUser_post,
  signInUser_post,
  users_get,
  deleteUser_delete,
} from "../controllers/userControllers.js";

import {
  deletePost_delete,
  teamPosts_get,
  userCreatePost_post,
} from "../controllers/userPostControllers.js";

import {
  requiresAuth,
  getTeamByTeamId,
  getPlayerById,
  getPostById,
} from "../middleware/authMiddleware.js";
import {
  multerUploadsTeam,
  multerUploadsMultiple,
  multerUploadsCoach,
  multerUploadsPosts,
} from "../middleware/multer.js";

const router = Router();

//  PARAM MIDDLEWARE WILL RUN ANY TIME THE PARAMETER IS TEAMID and set req.userTeamId to the teamId parameter
router.param("teamId", getTeamByTeamId);
router.param("playerId", getPlayerById);
router.param("postId", getPostById);

// ADMIN ROUTES
router.post("/api/createAdminUser", createAdminUser_post);
router.get("/api/admin/adminUsers/:teamId", requiresAuth, getAllAdminUsers_get);
router.put(
  "/api/admin/updateAdminUsers/:teamId",
  requiresAuth,
  updateAdminUsers_put
);
router.delete(
  "/api/admin/updateRemoveAdminUser/:teamId",
  requiresAuth,
  deleteAdminUser_delete
);

// admin routes for admin to work with user accounts
router.post("/api/admin/createUser/:teamId", requiresAuth, authNewUser_post);
router.get("/api/admin/users", requiresAuth, users_get);

// router.delete("/api/admin/users/deleteUser/:teamId", requiresAuth, deleteUser_delete);

// ADMIN USER AND USER SIGN IN SIGNOUT ROUTES
router.post("/api/admin/signin", signInAdminUser_post);
router.post("/api/user/signin", signInUser_post);
router.get("/api/signout", signOutUser_get);

// TEAM ROUTES
router.post("/api/admin/team", requiresAuth, multerUploadsTeam, createTeam_post);
router.get("/api/admin/team/:teamId", requiresAuth, team_get);
router.put(
  "/api/admin/team/updateImage/:team",
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
router.delete(
  "/api/admin/players/delete/:teamId",
  requiresAuth,
  deletePlayer_delete
);

// COACHES ROUTES
router.post(
  "/api/admin/coaches/createCoach/:teamId",
  requiresAuth,
  multerUploadsCoach,
  authCoaches_post
);
router.get("/api/admin/coaches/:teamId", coaches_get);
router.put(
  "/api/admin/coaches/updateCoach/:teamId",
  requiresAuth,
  multerUploadsCoach,
  updateCoachData_put
);
router.delete(
  "/api/admin/coaches/delete/:teamId",
  requiresAuth,
  deleteCoach_delete
);

// SCHEDULE ROUTES
router.post(
  "/api/admin/createSchedule/:teamId",
  requiresAuth,
  authSchedule_post
);
router.get("/api/admin/schedule/:teamId", requiresAuth, schedule_get);
router.put(
  "/api/admin/schedule/updateSchedule/:teamId",
  requiresAuth,
  updateSchedule_put
);

router.delete(
  "/api/admin/schedule/delete/:teamId",
  requiresAuth,
  deleteScheduleDate_delete
);

// USER ROUTES

router.post("/api/user/createUser", userCreateUser_post);
router.delete("/api/users/delete/:teamId", requiresAuth, deleteUser_delete);

// POSTS ROUTES
router.post(
  "/api/user/posts/:teamId",
  requiresAuth,
  multerUploadsPosts,
  userCreatePost_post
);

router.get("/api/user/posts/:teamId", requiresAuth, teamPosts_get);

router.delete(
  "/api/user/posts/delete/:teamId",
  requiresAuth,
  deletePost_delete
);

export { router as authRoute };
