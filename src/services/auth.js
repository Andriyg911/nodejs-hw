import crypto from "crypto";
import { Session } from "../models/session.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/time.js";

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(32).toString("hex");
  const refreshToken = crypto.randomBytes(32).toString("hex");

  const now = Date.now();
  const accessTokenValidUntil = new Date(now + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(now + ONE_DAY);

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
};

export const setSessionCookies = (res, session) => {
  const accessOpts = { httpOnly: true, secure: true, sameSite: "none", maxAge: FIFTEEN_MINUTES };
  const refreshOpts = { httpOnly: true, secure: true, sameSite: "none", maxAge: ONE_DAY };

  res.cookie("accessToken", session.accessToken, accessOpts);
  res.cookie("refreshToken", session.refreshToken, refreshOpts);
  res.cookie("sessionId", session._id.toString(), refreshOpts);
};