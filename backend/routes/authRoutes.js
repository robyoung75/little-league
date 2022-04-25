import Router from "express";

import { adminUser_post } from "../controllers/authControllers.js";

const router = Router();

router.post("/api/adminUser", adminUser_post);

export { router as authRoute };
