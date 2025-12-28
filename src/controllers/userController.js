import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

// GET /users/me
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) throw createHttpError(404, "User not found");

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar, // узгоджено з моделлю
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /users/me/avatar
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw createHttpError(400, "No file uploaded");

    const result = await saveFileToCloudinary(req.file.buffer); // узгоджено з multer.memoryStorage()

    const user = await User.findById(req.user?.id);
    if (!user) throw createHttpError(404, "User not found");

    user.avatar = result.secure_url; // узгоджено з моделлю
    await user.save();

    res.json({ message: "Avatar updated", avatar: user.avatar });
  } catch (err) {
    next(err);
  }
};

// STUBS
export const getProfileStub = (req, res) => {
  res.json({ message: "User profile (stub)" });
};

export const updateAvatarStub = (req, res) => {
  res.json({ message: "Avatar updated (stub)" });
};