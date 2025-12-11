import mongoose from "mongoose";
import { TAGS } from "../constants/tags.js"; // ⬅️ з розширенням .js

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
    },
    content: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      enum: TAGS, // ⬅️ використовуємо імпортований масив
      default: "Todo",
    },
  },
  {
    timestamps: true,
  }
);

// ⬅️ текстовий індекс для пошуку по title та content
noteSchema.index({ title: "text", content: "text" });

export const Note = mongoose.model("Note", noteSchema);