import { addVote } from "@/lib/data";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ eventId: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { eventId } = await params;
  const body = (await request.json()) as { teamId?: string; voterKey?: string };

  if (!body.teamId || !body.voterKey) {
    return NextResponse.json({ message: "Team and voter are required." }, { status: 400 });
  }

  const result = await addVote(eventId, body.teamId, body.voterKey);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({ message: "Vote submitted." }, { status: 201 });
}
