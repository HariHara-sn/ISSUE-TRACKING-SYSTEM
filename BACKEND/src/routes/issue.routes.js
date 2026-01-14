import express from "express";
import { createIssue } from "../controllers/issue.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { getUnassignedIssues } from "../controllers/issue.controller.js";
import { assignIssueToStaff } from "../controllers/issue.controller.js";
import { stafflist } from "../controllers/issue.controller.js";
// import User from "../models/user.model.js";
const router = express.Router();

// ONLY STUDENT CAN CREATE ISSUE
router.post("/create", protect, authorizeRoles("student"), createIssue);

router.get("/pending", protect, authorizeRoles("admin"), getUnassignedIssues);

router.put("/assign", protect, authorizeRoles("admin"), assignIssueToStaff);

// Get all staff list
router.get("/staff", protect, authorizeRoles("admin"), stafflist);


export default router;
