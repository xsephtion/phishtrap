import dbConnect from "@/lib/mongodb";
import { Quiz, QuizInterface } from "@/models/Quiz";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const bodyRequest = await request.json();
  try {
    const data = addQuiz(bodyRequest);
    return NextResponse.json({ data });
  } catch (e) {
    console.log("error: ", e);
    return NextResponse.json({ failed: true }, { status: 400 });
  }
}

async function addQuiz(body: QuizInterface) {
  const findOne = await Quiz.findOne({ email: body.email });
  const findOneQuiz = findOne?.quiz ?? [];
  findOneQuiz.push(body.quiz);
  const update = await Quiz.findOneAndUpdate(
    { email: body.email },
    { quiz: findOneQuiz },
    { upsert: true }
  );
  return update;
}
