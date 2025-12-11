import express from "express";
import dotenv from "dotenv";
import { connectMongoDB } from "./db/connectMongoDB.js";
import notesRoutes from "./routes/notesRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { errors } from "celebrate"; // ⬅️ ОЦЕ ТРЕБА ДОДАТИ

dotenv.config();

const app = express();

app.use(express.json());

// Роутінг
app.use("/notes", notesRoutes);

// Обробка неіснуючих маршрутів
app.use(notFoundHandler);

// Обробка помилок celebrate
app.use(errors()); // ⬅️ ОБОВʼЯЗКОВО ПЕРЕД errorHandler

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