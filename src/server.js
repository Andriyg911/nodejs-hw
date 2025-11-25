import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';

dotenv.config();

const app = express();

// Підключаємо middleware
app.use(cors());
app.use(express.json());
app.use(pinoHttp());

// Маршрут для всіх нотаток
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// Маршрут для однієї нотатки за ID
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// Тестовий маршрут для помилки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Middleware для 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware для 500
app.use((err, req, res, _next) => {
  req.log?.error(err);
  res.status(500).json({ message: err.message });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});