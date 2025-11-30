
import { isHttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {
  // Якщо це HttpError — використовуємо його статус
  if (isHttpError(err)) {
    return res.status(err.status).json({ message: err.message });
  }

  // Якщо це не HttpError — віддаємо 500
  console.error("Unexpected error:", err);
  return res.status(500).json({ message: "Internal Server Error" });
};