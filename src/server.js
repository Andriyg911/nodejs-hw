import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";

import { connectMongoDB } from "./db/connectMongoDB.js";
import logger from "./middleware/logger.js";
import notFoundHandler from "./middleware/notFoundHandler.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// маршрути без префіксів
app.use(authRoutes);
app.use(userRoutes);
app.use(notesRoutes);

// обробка помилок
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });