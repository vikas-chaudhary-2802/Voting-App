import { getEventSnapshot } from "@/lib/data";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ eventId: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { eventId } = await params;
  const snapshot = await getEventSnapshot(eventId);

  if (!snapshot) {
    return NextResponse.json({ message: "Event not found." }, { status: 404 });
  }

  return NextResponse.json(snapshot);
}
