import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { createSession, setSessionCookies } from "../services/auth.js";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) throw createHttpError(400, "Email in use");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: passwordHash });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, "Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw createHttpError(401, "Invalid credentials");

    await Session.deleteMany({ userId: user._id });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies || {};
    if (!sessionId || !refreshToken) throw createHttpError(401, "Session not found");

    const session = await Session.findById(sessionId);
    if (!session || session.refreshToken !== refreshToken) {
      throw createHttpError(401, "Session not found");
    }

    if (session.refreshTokenValidUntil.getTime() < Date.now()) {
      await Session.findByIdAndDelete(sessionId);
      throw createHttpError(401, "Session token expired");
    }

    await Session.findByIdAndDelete(sessionId);
    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({ message: "Session refreshed" });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies || {};
    if (sessionId) await Session.findByIdAndDelete(sessionId);

    const clearOpts = { httpOnly: true, secure: true, sameSite: "none" };
    res.clearCookie("accessToken", clearOpts);
    res.clearCookie("refreshToken", clearOpts);
    res.clearCookie("sessionId", clearOpts);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};