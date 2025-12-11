import express from "express";
import { celebrate } from "celebrate";
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from "../validations/notesValidation.js";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

const router = express.Router();

// GET /notes — з фільтрацією, пошуком, пагінацією
router.get("/", celebrate(getAllNotesSchema), getAllNotes);

// GET /notes/:noteId — з валідацією ObjectId
router.get("/:noteId", celebrate(noteIdSchema), getNoteById);

// POST /notes — з валідацією тіла
router.post("/", celebrate(createNoteSchema), createNote);

// PATCH /notes/:noteId — з валідацією ObjectId + тіла
router.patch("/:noteId", celebrate(updateNoteSchema), updateNote);

// DELETE /notes/:noteId — з валідацією ObjectId
router.delete("/:noteId", celebrate(noteIdSchema), deleteNote);

export default router;