import { Joi, Segments } from "celebrate";

// GET /notes?tag=...
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    tag: Joi.string(),
  }),
};

// GET /notes/:noteId та DELETE /notes/:noteId
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().hex().length(24).required(),
  }),
};

// POST /notes
export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
  }),
};

// PATCH /notes/:noteId
export const updateNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string(),
    content: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  }),
};