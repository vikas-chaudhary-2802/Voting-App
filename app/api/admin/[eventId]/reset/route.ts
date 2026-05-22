import { resetVotes } from "@/lib/data";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ eventId: string }>;
};

export async function POST(_: Request, { params }: Params) {
  const { eventId } = await params;
  await resetVotes(eventId);
  return NextResponse.json({ message: "Votes reset." });
}
