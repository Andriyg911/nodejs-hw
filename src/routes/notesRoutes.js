import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from "../controllers/notesController.js";

const router = Router();

router.use(authenticate);

router.get("/notes", getAllNotes);
router.get("/notes/:noteId", getNoteById);
router.post("/notes", createNote);
router.patch("/notes/:noteId", updateNote);
router.delete("/notes/:noteId", deleteNote);

export default router;