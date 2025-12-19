import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
  },
  { timestamps: true }
);

// Видаляти пароль з відповіді
userSchema.method("toJSON", function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
});

// За замовчуванням username = email
userSchema.pre("save", function (next) {
  if (!this.username) this.username = this.email;
  next();
});

export const User = mongoose.model("User", userSchema);