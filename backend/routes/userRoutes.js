import express from "express";
import {
  login,
  loginWithGoogle,
  register,
  logout,
  updateProfile,
  getUserInfo,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/google", loginWithGoogle);
router.post("/register", register);
router.post("/logout", logout);
router.put("/profile/:id", protectRoute, updateProfile);
router.get("/:id", protectRoute, getUserInfo);

export default router;
