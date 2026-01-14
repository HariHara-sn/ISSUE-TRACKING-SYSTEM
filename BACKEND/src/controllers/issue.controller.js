//Controller for Student Submitting an Issue
import logger from "../config/logger.js";
import Issue from "../models/issue.model.js";
import User from "../models/user.model.js";

export const createIssue = async (req, res) => {
  try {
    const { title, description, location, priority } = req.body;

    const issue = await Issue.create({
      title,
      description,
      location,
      priority,
      createdBy: req.user.id, // student ID from JWT
    });

    res.status(201).json({
      message: "Issue submitted successfully",
      issue,
    });
    logger.info(`Issue Submitted successfully ✅`);

  } catch (error) {
    console.error(error);
    logger.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Admin Should See “Issues Waiting for Assignment"
export const getUnassignedIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ status: "Pending" }).populate(
      "createdBy",
      "name email"
    );

    res.json({ issues });
  } catch (error) {
    logger.error(error);

    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const stafflist = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("name email");
    res.json({ staff });

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const assignIssueToStaff = async (req, res) => {
  try {
    const { issueId, staffId } = req.body;

    if (!issueId || !staffId) {
      return res.status(400).json({ message: "Issue ID and Staff ID are required" });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      {
        assignedTo: staffId,
        status: "Assigned",
      },
      { new: true }

    ).populate("assignedTo", "name email role");

    if (!updatedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({
      message: "Issue assigned successfully",
      issue: updatedIssue,
    });
    logger.info(`Issue assigned successfully ✅`);

  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
