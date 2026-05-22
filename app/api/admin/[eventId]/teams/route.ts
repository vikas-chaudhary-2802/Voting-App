import { saveTeam } from "@/lib/data";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ eventId: string }>;
};

export async function POST(request: Request, { params }: Params) {
  const { eventId } = await params;
  const body = (await request.json()) as {
    id?: string;
    teamName?: string;
    startupName?: string;
    description?: string;
    members?: string[];
    color?: string;
  };

  if (!body.teamName || !body.startupName || !body.description) {
    return NextResponse.json({ message: "Team name, startup name, and description are required." }, { status: 400 });
  }

  const team = await saveTeam({
    id: body.id,
    eventId,
    teamName: body.teamName,
    startupName: body.startupName,
    description: body.description,
    members: body.members || [],
    color: body.color || "#ff6b00"
  });

  return NextResponse.json(team);
}
