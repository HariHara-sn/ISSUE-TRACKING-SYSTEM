//Controller for Student Submitting an Issue
import logger from "../config/logger.js";
import Issue from "../models/issue.model.js";
import User from "../models/user.model.js";

export const createIssue = async (req, res) => {
  try {
    const { title, description, location, priority, category, image } = req.body;

    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      priority,
      image,
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

// export const getAllIssues = async (req, res) => {
//   try {
//     const issues = await Issue.find().populate(
//       "createdBy",
//       "name email"
//     );
//     res.json({ issues });
//     logger.info(`All issues fetched successfully ✅`);
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

export const getStudentOpenIssues = async (req, res) => {
  try {
    const studentId = req.user._id; // from JWT

    const issues = await Issue.find({
      createdBy: studentId,
      status: "Pending"
    });

    res.json({ issues });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



export const getAllIssues = async (req, res) => {
  try {
    let filter = {};  // default — admin will see all issues

    if (req.user.role === "student") {
      // Student: only issues created by them
      filter = { createdBy: req.user._id };
    }

    if (req.user.role === "staff") {
      // Staff: only issues assigned to them
      filter = { assignedTo: req.user._id };
    }

    // Admin: filter stays empty → gets all issues

    const issues = await Issue.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.json({ issues });
    
    logger.info(`Issues fetched for ${req.user.role} successfully ✅`);
  } catch (error) {
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
    logger.info(`All unassigned issues fetched successfully ✅`);
  } catch (error) {
    logger.error(error);

    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getStudentAssignedIssues = async (req, res) => {
  try {
    const studentId = req.user._id;

    const issues = await Issue.find({
      assignedTo: studentId,
      status: "Assigned"
    });

    res.json({ issues });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getStaffAssignedIssues = async (req, res) => {
  try {
    const staffId = req.user._id;

    const issues = await Issue.find({
      assignedTo: staffId,
      status: "Assigned"
    });

    res.json({ issues });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getResolvedIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ status: "Resolved" }).populate(
      "createdBy",
      "name email"
    );

    res.json({ issues });
    logger.info(`All resolved issues fetched successfully ✅`);
  } catch (error) {
    logger.error(error);

    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export const getStudentResolvedIssues = async (req, res) => {
  try {
    const studentId = req.user._id;

    const issues = await Issue.find({
      createdBy: studentId,
      status: "Resolved"
    });

    res.json({ issues });
    logger.info(`All particular student resolved issues fetched successfully ✅`);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export const getStaffResolvedIssues = async (req, res) => {
  try {
    const staffId = req.user._id;

    const issues = await Issue.find({
      assignedTo: staffId,
      status: "Resolved"
    });

    res.json({ issues });
    logger.info(`All particular staff resolved issues fetched successfully ✅`);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
export const stafflist = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }).select("name email");
    res.json({ staff });
    logger.info(`All staff list fetched successfully ✅`);

  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const studentlist = async (req, res ) => {
  try {
    const studentlist = await User.find({role : "student"}).select("name email");
    res.json({studentlist});
    logger.info(`All student list fetched successfully ✅`);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}
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
