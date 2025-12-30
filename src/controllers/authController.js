import fs from "node:fs/promises";
import path from "node:path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import handlebars from "handlebars";

import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { sendEmail } from "../utils/sendMail.js";

const {
  JWT_SECRET,
  FRONTEND_DOMAIN, // e.g. https://your-frontend.com
} = process.env;

// ================== SESSION HELPERS ==================

const createSession = async (userId) => {
  // видаляємо старі сесії користувача
  await Session.deleteMany({ userId });

  // створюємо нову
  const session = await Session.create({ userId });

  // генеруємо токени
  const accessToken = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });

  session.refreshToken = refreshToken;
  await session.save();

  return { session, accessToken, refreshToken };
};

const setSessionCookies = (res, sessionId, accessToken, refreshToken) => {
  res.cookie("sessionId", sessionId, { httpOnly: true, sameSite: "strict" });
  res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "strict" });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
};

// ================== PASSWORD RESET ==================

// POST /auth/request-reset-email
export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "If the email exists, a reset link has been sent." });
    }

    const token = jwt.sign(
      { sub: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${FRONTEND_DOMAIN}/reset-password?token=${encodeURIComponent(token)}`;

    const templatePath = path.join(process.cwd(), "src", "templates", "reset-password-email.html");
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
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      throw createHttpError(400, "Invalid or expired token");
    }

    const user = await User.findById(payload.sub);
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

// ================== AUTH ==================

// POST /auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw createHttpError(409, "Email already in use");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, password: hash, username });

    const { session, accessToken, refreshToken } = await createSession(user._id);
    setSessionCookies(res, session._id, accessToken, refreshToken);

    res.status(201).json(user); // toJSON видалить пароль
  } catch (err) {
    next(err);
  }
};

// POST /auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, "Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw createHttpError(401, "Invalid credentials");

    const { session, accessToken, refreshToken } = await createSession(user._id);
    setSessionCookies(res, session._id, accessToken, refreshToken);

    res.json({ message: "Login successful" });
  } catch (err) {
    next(err);
  }
};

// POST /auth/refresh
export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;
    if (!sessionId || !refreshToken) throw createHttpError(400, "Missing session cookies");

    const session = await Session.findById(sessionId);
    if (!session) throw createHttpError(401, "Session not found");

    if (session.refreshToken !== refreshToken) throw createHttpError(401, "Invalid refresh token");

    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET);
    } catch {
      throw createHttpError(401, "Expired refresh token");
    }

    const accessToken = jwt.sign({ sub: payload.sub }, JWT_SECRET, { expiresIn: "15m" });
    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "strict" });

    res.json({ message: "Session refreshed" });
  } catch (err) {
    next(err);
  }
};

// POST /auth/logout
export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;
    if (sessionId) {
      await Session.findByIdAndDelete(sessionId);
    }

    res.clearCookie("sessionId");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "User logged out" });
  } catch (err) {
    next(err);
  }
};