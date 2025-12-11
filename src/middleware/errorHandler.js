import { isHttpError } from "http-errors";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({ message: "Internal Server Error" });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};