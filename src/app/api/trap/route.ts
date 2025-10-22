import dbConnect from "@/lib/mongodb";
import { Quiz, QuizInterface } from "@/models/Quiz";
import { Trap, TrapInterface } from "@/models/Trap";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const bodyRequest = await request.json();
  try {
    const data = addTrap(bodyRequest);
    return NextResponse.json({ data });
  } catch (e) {
    console.log("error: ", e);
    return NextResponse.json({ failed: true }, { status: 400 });
  }
}

async function addTrap(body: TrapInterface) {
  const update = await Trap.create({ ...body });
  return update;
}
