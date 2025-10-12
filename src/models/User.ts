// models/User.ts
import mongoose from "mongoose";

interface UserInterface {
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Hashed password
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<UserInterface>("User", UserSchema);
