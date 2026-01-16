// after user fill the form
import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    
    location: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    image: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved"],
      default: "Pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema, "issues");
export default Issue;
