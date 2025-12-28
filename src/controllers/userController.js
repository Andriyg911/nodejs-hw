import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

// GET /users/me
export const getProfile = async (req, res, next) => {
  try {
    // тут можна брати userId з JWT, але поки заглушка
    const user = await User.findById(req.user?.id);
    if (!user) throw createHttpError(404, "User not found");

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatarUrl,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me/avatar
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw createHttpError(400, "No file uploaded");

    const result = await saveFileToCloudinary(req.file.path);

    const user = await User.findById(req.user?.id);
    if (!user) throw createHttpError(404, "User not found");

    user.avatarUrl = result.secure_url;
    await user.save();

    res.json({ message: "Avatar updated", avatarUrl: user.avatarUrl });
  } catch (err) {
    next(err);
  }
};

// ================== STUBS ==================
// Якщо немає JWT‑middleware, можна залишити заглушки

export const getProfileStub = (req, res) => {
  res.json({ message: "User profile (stub)" });
};

export const updateAvatarStub = (req, res) => {
  res.json({ message: "Avatar updated (stub)" });
};