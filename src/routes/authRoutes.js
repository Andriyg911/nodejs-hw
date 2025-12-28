import express from "express";
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword
} from "../controllers/authController.js";

const router = express.Router();

// базові маршрути автентифікації
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/refresh", refreshUserSession);
router.post("/auth/logout", logoutUser);

// маршрути для відновлення пароля
router.post("/auth/request-reset-email", requestResetEmail);
router.post("/auth/reset-password", resetPassword);

export default router;