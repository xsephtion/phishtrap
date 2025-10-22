import dbConnect from "@/lib/mongodb";
import { Quiz } from "@/models/Quiz";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email") || "";
  const simulation = searchParams.get("simulation") === "true";
  const all = searchParams.get("all") === "true";

  const result = await getQuiz({ email, simulation, all });

  return NextResponse.json({ result });
}

async function getQuiz(request: {
  email?: string;
  simulation?: boolean;
  all?: boolean;
}) {
  const quizType = request.simulation ? "simulation" : "choices";
  console.log("request", request.all);
  if (Boolean(request.all)) {
    console.log("called");
    const result = await Quiz.aggregate([
      { $unwind: "$quiz" },
      {
        $match: {
          $or: [
            { "quiz.quizType": "simulation" },
            { "quiz.quizType": "choices" },
          ],
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$quiz", { email: "$email" }],
          },
        },
      },
      {
        $group: {
          _id: null,
          quiz: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          quiz: 1,
        },
      },
    ]);
    return result[0] || null;
  }

  if (request.email) {
    if (request.simulation) {
      const result = await Quiz.aggregate([
        { $match: { email: request.email } },
        { $unwind: "$quiz" },
        { $match: { "quiz.quizType": quizType } },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$quiz", { email: "$email" }],
            },
          },
        },
        {
          $group: {
            _id: null,
            quiz: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            quiz: 1,
          },
        },
      ]);
      return result[0] || null;
    } else {
      const result = await Quiz.aggregate([
        { $match: { email: request.email } },
        { $unwind: "$quiz" },
        { $match: { "quiz.quizType": quizType } },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$quiz", { email: "$email" }],
            },
          },
        },
        {
          $group: {
            _id: null,
            quiz: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            quiz: 1,
          },
        },
      ]);
      return result[0] || null;
    }
  } else {
    if (request.simulation) {
      const result = await Quiz.aggregate([
        { $unwind: "$quiz" },
        { $match: { "quiz.quizType": quizType } },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$quiz", { email: "$email" }],
            },
          },
        },
        {
          $group: {
            _id: null,
            quiz: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            quiz: 1,
          },
        },
      ]);
      return result[0] || null;
    } else {
      const result = await Quiz.aggregate([
        { $unwind: "$quiz" },
        { $match: { "quiz.quizType": quizType } },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$quiz", { email: "$email" }],
            },
          },
        },
        {
          $group: {
            _id: null,
            quiz: { $push: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 0,
            quiz: 1,
          },
        },
      ]);
      return result[0] || null;
    }
  }
}
