import mongoose from "mongoose";
import { TAGS } from "../constants/tags.js";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      trim: true, // ⬅️ додано
    },
    content: {
      type: String,
      default: "",
      trim: true, // ⬅️ додано
    },
    tag: {
      type: String,
      enum: TAGS,
      default: "Todo",
    },
  },
  {
    timestamps: true,
  }
);

// текстовий індекс для пошуку по title та content
noteSchema.index({ title: "text", content: "text" });

export const Note = mongoose.model("Note", noteSchema);