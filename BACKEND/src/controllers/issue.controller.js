//Controller for Student Submitting an Issue
import Issue from "../models/issue.model.js";

export const createIssue = async (req, res) => {
  try {
    const { title, description, location, priority } = req.body;

    const issue = await Issue.create({
      title,
      description,
      location,
      priority,
      createdBy: req.user.id,  // student ID from JWT
    });

    res.status(201).json({
      message: "Issue submitted successfully",
      issue,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Admin Should See “Issues Waiting for Assignment"
export const getUnassignedIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ status: "Pending" }).populate("createdBy", "name email");

    res.json({ issues });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

