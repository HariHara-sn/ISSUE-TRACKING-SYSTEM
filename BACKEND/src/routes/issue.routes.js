import express from "express";
import { createIssue } from "../controllers/issue.controller.js";
import { protect} from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// ONLY STUDENT CAN CREATE ISSUE
router.post("/create", protect, authorizeRoles("student"), createIssue);

export default router;