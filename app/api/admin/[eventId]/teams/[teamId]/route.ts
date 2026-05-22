import { deleteTeam } from "@/lib/data";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ teamId: string }>;
};

export async function DELETE(_: Request, { params }: Params) {
  const { teamId } = await params;
  await deleteTeam(teamId);
  return NextResponse.json({ message: "Team deleted." });
}
