import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { createIssue, stafflist, studentlist, assignIssueToStaff, getUnassignedIssues, getAllIssues, getStudentOpenIssues } from "../controllers/issue.controller.js";
import {getAllAssignedIssues, getStudentAssignedIssues, getStaffAssignedIssues} from "../controllers/issue.controller.js";
import {getResolvedIssues, getStudentResolvedIssues, getStaffResolvedIssues} from "../controllers/issue.controller.js";
const router = express.Router();


// ONLY STUDENT CAN CREATE ISSUE
router.post("/create", protect, authorizeRoles("student"), createIssue);

// List All Issues assigned, pending, resolved
router.get("/openIssues", protect, authorizeRoles("admin"), getAllIssues);

// List Particular Student Open Issues
router.get("/student/openIssues", protect, authorizeRoles("student"), getStudentOpenIssues);


// List All Unassigned Issues - need to assign
router.get("/pending", protect, getUnassignedIssues);

router.get('/assigned',protect, authorizeRoles("admin"), getAllAssignedIssues)
// List All Assigned Issues based on role
router.get("/student/assignedIssues", protect, authorizeRoles("student"), getStudentAssignedIssues);
router.get("/staff/assignedIssues", protect, authorizeRoles("staff"), getStaffAssignedIssues);

// List the Resolved Issues
router.get('/resolved', protect, authorizeRoles("admin"), getResolvedIssues);
router.get('/student/resolved',protect, authorizeRoles("student"), getStudentResolvedIssues);
router.get('/staff/resolved',protect, authorizeRoles("staff"), getStaffResolvedIssues);

router.put("/assign", protect, authorizeRoles("admin"), assignIssueToStaff);

// Get all staff list
router.get("/staff", protect, authorizeRoles("admin"), stafflist);

// Get all student list
router.get('/student', protect, authorizeRoles("admin"), studentlist);

export default router;