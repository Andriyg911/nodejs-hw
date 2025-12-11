import { Note } from "../models/note.js";
import createError from "http-errors";

// GET /notes
export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    let query = Note.find();

    if (tag) {
      query = query.where("tag").equals(tag);
    }
    if (search) {
      query = query.where({ $text: { $search: search } });
    }

    const skip = (Number(page) - 1) * Number(perPage);

    const [notes, totalNotes] = await Promise.all([
      query.skip(skip).limit(Number(perPage)),
      Note.countDocuments(query.getFilter()),
    ]);

    const totalPages = Math.ceil(totalNotes / Number(perPage));

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

// GET /notes/:noteId
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) {
      throw createError(404, "Note not found");
    }
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

// PATCH /notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      throw createError(404, "Note not found");
    }
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findByIdAndDelete(noteId);
    if (!note) {
      throw createError(404, "Note not found");
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    next(err);
  }
};