import mongoose from "mongoose";

interface QuizDetails {
  quizType: string;
  score: string;
}

export interface QuizInterface {
  email: string;
  quiz: QuizDetails[];
}

const QuizSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    quiz: { type: [{ quizType: String, score: String }] },
  },
  { timestamps: true }
);

export const Quiz =
  mongoose.models.Quiz || mongoose.model<QuizInterface>("Quiz", QuizSchema);
