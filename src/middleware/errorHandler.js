import { isHttpError } from "http-errors";

/**
 * Глобальний обробник помилок
 */
const errorHandler = (err, req, res, _next) => {
  if (isHttpError(err)) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;

/**
 * Обробник неіснуючих маршрутів (404)
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};