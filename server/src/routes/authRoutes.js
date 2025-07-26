import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/me", isAuthenticated, asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
}));

export default router;
