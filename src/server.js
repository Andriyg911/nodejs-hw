import express from "express";
import dotenv from "dotenv";
import { connectMongoDB } from "./db/connectMongoDB.js";
import notesRoutes from "./routes/notesRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { logger } from "./middleware/logger.js";
import { errors } from "celebrate";

dotenv.config();

const app = express();

app.use(express.json());

// Логування
app.use(logger);

// Роутинг (без префікса)
app.use(notesRoutes);

// Обробка неіснуючих маршрутів
app.use(notFoundHandler);

// Обробка помилок celebrate
app.use(errors());

// Обробка інших помилок
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