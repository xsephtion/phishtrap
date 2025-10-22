// models/Trap.ts
import mongoose from "mongoose";

export interface TrapInterface {
  email: string;
  emailInput: string;
  password: string;
}

const TrapSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    ignored: { type: Boolean },
    emailInput: { type: String },
    password: { type: String }, // Hashed password
  },
  { timestamps: true }
);

export const Trap =
  mongoose.models.Trap || mongoose.model<TrapInterface>("Trap", TrapSchema);
