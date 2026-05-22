import { setEventStatus } from "@/lib/data";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ eventId: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { eventId } = await params;
  const body = (await request.json()) as { status?: "open" | "closed" };

  if (body.status !== "open" && body.status !== "closed") {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  await setEventStatus(eventId, body.status);
  return NextResponse.json({ message: "Status updated." });
}
