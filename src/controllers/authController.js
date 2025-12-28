import fs from "node:fs/promises";
import path from "node:path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import handlebars from "handlebars";

import { User } from "../models/user.js";
import { sendEmail } from "../utils/sendMail.js";

const {
  JWT_RESET_SECRET,
  FRONTEND_DOMAIN, // e.g. https://your-frontend.com
} = process.env;

// ================== PASSWORD RESET ==================

// POST /auth/request-reset-email
export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Не розкриваємо, чи існує email — відповідаємо успіхом
      return res
        .status(200)
        .json({ message: "If the email exists, a reset link has been sent." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_RESET_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${FRONTEND_DOMAIN}/reset-password?token=${encodeURIComponent(
      token
    )}`;

    const templatePath = path.join(
      process.cwd(),
      "src",
      "templates",
      "reset-password-email.html"
    );
    const raw = await fs.readFile(templatePath, "utf-8");
    const tpl = handlebars.compile(raw);
    const html = tpl({ username: user.username ?? user.email, resetLink });

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html,
    });

    res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    next(err);
  }
};

// POST /auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token) throw createHttpError(400, "Token is required");
    if (!password) throw createHttpError(400, "Password is required");

    let payload;
    try {
      payload = jwt.verify(token, JWT_RESET_SECRET);
    } catch {
      throw createHttpError(400, "Invalid or expired token");
    }

    const user = await User.findById(payload.userId);
    if (!user) throw createHttpError(404, "User not found");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (err) {
    next(err);
  }
};

// ================== STUBS FOR OTHER ROUTES ==================

// POST /auth/register
export const registerUser = (req, res) => {
  res.json({ message: "User registered (stub)" });
};

// POST /auth/login
export const loginUser = (req, res) => {
  res.json({ message: "User logged in (stub)" });
};

// POST /auth/refresh
export const refreshUserSession = (req, res) => {
  res.json({ message: "Session refreshed (stub)" });
};

// POST /auth/logout
export const logoutUser = (req, res) => {
  res.json({ message: "User logged out (stub)" });
};