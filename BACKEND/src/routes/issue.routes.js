import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { createIssue, stafflist, studentlist, assignIssueToStaff, getUnassignedIssues, getAllIssues } from "../controllers/issue.controller.js";
const router = express.Router();


// ONLY STUDENT CAN CREATE ISSUE
router.post("/create", protect, authorizeRoles("student"), createIssue);

// List All Issues
router.get("/openIssues", protect, getAllIssues);

// List All Unassigned Issues
router.get("/pending", protect, getUnassignedIssues);

// List All Resolved Issues
router.get('/resolved', protect, getResolvedIssues);

router.put("/assign", protect, authorizeRoles("admin"), assignIssueToStaff);

// Get all staff list
router.get("/staff", protect, authorizeRoles("admin"), stafflist);

// Get all student list
router.get('/student', protect, authorizeRoles("admin"), studentlist);

export default router;