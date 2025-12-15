import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ⬅️ новий імпорт
import { connectMongoDB } from "./db/connectMongoDB.js";
import notesRoutes from "./routes/notesRoutes.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { errors } from "celebrate";

dotenv.config();

const app = express();

app.use(logger);
app.use(express.json());
app.use(cors()); // ⬅️ застосування cors

app.use(notesRoutes);

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
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });