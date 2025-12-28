import express from "express";
import { updateAvatar, getProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/users/me", getProfile);
router.patch("/users/me/avatar", updateAvatar);

export default router;