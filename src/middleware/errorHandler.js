// src/middleware/errorHandler.js
import { isHttpError } from "http-errors";

// Основний мідлвар для обробки помилок
export const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({ message: "Internal Server Error" });
};

// Мідлвар для 404
export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};