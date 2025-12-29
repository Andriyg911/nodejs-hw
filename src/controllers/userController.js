import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

// PATCH /users/me/avatar
export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw createHttpError(400, "No file uploaded");

    const result = await saveFileToCloudinary(req.file.buffer);

    const user = await User.findById(req.user._id); // ✅ використовуємо _id
    if (!user) throw createHttpError(404, "User not found");

    user.avatar = result.secure_url;
    await user.save();

    res.status(200).json({ url: user.avatar }); // ✅ правильний формат + статус 200
  } catch (err) {
    next(err);
  }
};