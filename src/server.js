import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errors } from "celebrate";
import createHttpError from "http-errors";

import { connectMongoDB } from "./db/connectMongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// реєстрація маршрутів
app.use(authRoutes);
app.use(userRoutes);

// 404 handler
app.use((req, res, next) => {
  next(createHttpError(404, "Route not found"));
});

// celebrate errors
app.use(errors());

// error handler
app.use((err, req, res, _next) => {
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

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