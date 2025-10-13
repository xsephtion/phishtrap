import dbConnect from "@/lib/mongodb";
import { Quiz, QuizInterface } from "@/models/Quiz";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email") || "";
  const simulation = searchParams.get("simulation") === "true";

  const result = await getQuiz({ email, simulation });

  return NextResponse.json(result || { message: "No data found" }, {
    status: result ? 200 : 404,
  });
}

async function getQuiz(request: { email?: string; simulation?: boolean }) {
  let get = null;
  if (request.email) {
    if (request.simulation) {
      const result = await Quiz.aggregate([
        { $match: { email: request.email } },
        {
          $project: {
            email: 1,
            quiz: {
              $filter: {
                input: "$quiz",
                as: "item",
                cond: { $eq: ["$$item.quizType", "simulation"] },
              },
            },
          },
        },
      ]);
      return result[0] || null;
    } else {
      const result = await Quiz.aggregate([
        { $match: { email: request.email } },
        {
          $project: {
            email: 1,
            quiz: {
              $filter: {
                input: "$quiz",
                as: "item",
                cond: { $eq: ["$$item.quizType", "choices"] },
              },
            },
          },
        },
      ]);
      return result[0] || null;
    }
  } else {
    if (request.simulation) {
      const result = await Quiz.aggregate([
        {
          $project: {
            email: 1,
            quiz: {
              $filter: {
                input: "$quiz",
                as: "item",
                cond: { $eq: ["$$item.quizType", "simulation"] },
              },
            },
          },
        },
      ]);
      return result[0] || null;
    } else {
      const result = await Quiz.aggregate([
        {
          $project: {
            email: 1,
            quiz: {
              $filter: {
                input: "$quiz",
                as: "item",
                cond: { $eq: ["$$item.quizType", "choices"] },
              },
            },
          },
        },
      ]);
      return result[0] || null;
    }
  }
}
