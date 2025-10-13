import mongoose from "mongoose";

interface QuizDetails {
  quizType: string;
  score: string;
  date: string;
}

export interface QuizInterface {
  email: string;
  quiz: QuizDetails[] | QuizDetails;
}

const QuizItemSchema = new mongoose.Schema(
  {
    quizType: { type: String, required: true },
    score: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const QuizSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    quiz: {
      type: [QuizItemSchema],
    },
  },
  { timestamps: true }
);

export const Quiz =
  mongoose.models.Quiz || mongoose.model<QuizInterface>("Quiz", QuizSchema);
