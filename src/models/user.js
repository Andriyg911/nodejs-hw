import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String }, // 🔄 тепер необов’язкове
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default: "https://ac.goit.global/fullstack/react/default-avatar.jpg",
    },
  },
  { timestamps: true }
);

// pre-hook: якщо username не вказано — ставимо email
userSchema.pre("save", function (next) {
  if (!this.username && this.email) {
    this.username = this.email;
  }
  next();
});

// toJSON: прибираємо пароль з відповіді
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model("User", userSchema);