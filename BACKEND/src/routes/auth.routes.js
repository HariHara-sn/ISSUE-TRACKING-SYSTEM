import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Only Admin can register Staff/Admin
router.post("/register", protect, authorizeRoles("admin"), registerUser);
// router.post("/register", registerUser); // remove protect + authorizeRoles temporarily

router.post("/login", loginUser);

/// login using token
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;
