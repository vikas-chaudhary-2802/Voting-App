import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { AppData, EventSnapshot, Team, Vote } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "votes.json");

const defaultData: AppData = {
  events: [
    {
      id: "startup-sprint-2026",
      name: "Inspire India Founder Circle",
      tagline: "Vote for the founder building the next big idea.",
      date: "2026-05-22T18:00:00+05:30",
      status: "open"
    }
  ],
  teams: [
    {
      id: "team-a",
      eventId: "startup-sprint-2026",
      teamName: "Team Orbit",
      startupName: "SkillBridge",
      description: "A mobile-first platform that connects college students with verified micro-internships from local startups.",
      members: ["Aarav", "Meera", "Kabir"],
      color: "#ff6b00"
    },
    {
      id: "team-b",
      eventId: "startup-sprint-2026",
      teamName: "Team Nova",
      startupName: "FarmPulse",
      description: "A low-cost crop advisory assistant that helps small farmers track soil, weather, and market prices.",
      members: ["Isha", "Rohan", "Diya"],
      color: "#10b981"
    },
    {
      id: "team-c",
      eventId: "startup-sprint-2026",
      teamName: "Team Catalyst",
      startupName: "CareLoop",
      description: "A simple care coordination app for families managing medicine reminders and doctor follow-ups.",
      members: ["Neel", "Anika", "Vivaan"],
      color: "#f97316"
    }
  ],
  votes: []
};

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(defaultData, null, 2));
  }
}

export async function readData(): Promise<AppData> {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw) as AppData;
}

export async function writeData(data: AppData): Promise<void> {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function getEventSnapshot(eventId: string): Promise<EventSnapshot | null> {
  const data = await readData();
  const event = data.events.find((item) => item.id === eventId);

  if (!event) {
    return null;
  }

  const teams = data.teams.filter((team) => team.eventId === eventId);
  const votes = data.votes.filter((vote) => vote.eventId === eventId);
  const totalVotes = votes.length;

  return {
    event,
    totalVotes,
    teams: teams
      .map((team) => {
        const teamVotes = votes.filter((vote) => vote.teamId === team.id).length;
        return {
          ...team,
          votes: teamVotes,
          percentage: totalVotes === 0 ? 0 : Math.round((teamVotes / totalVotes) * 100)
        };
      })
      .sort((a, b) => b.votes - a.votes || a.startupName.localeCompare(b.startupName))
  };
}

export async function addVote(eventId: string, teamId: string, voterKey: string) {
  const data = await readData();
  const event = data.events.find((item) => item.id === eventId);
  const team = data.teams.find((item) => item.id === teamId && item.eventId === eventId);

  if (!event || !team) {
    return { ok: false, status: 404, message: "Event or team not found." };
  }

  if (event.status !== "open") {
    return { ok: false, status: 403, message: "Voting is closed for this event." };
  }

  const existingVote = data.votes.find((vote) => vote.eventId === eventId && vote.voterKey === voterKey);

  if (existingVote) {
    return { ok: false, status: 409, message: "You have already voted." };
  }

  const vote: Vote = {
    id: crypto.randomUUID(),
    eventId,
    teamId,
    voterKey,
    createdAt: new Date().toISOString()
  };

  data.votes.push(vote);
  await writeData(data);
  return { ok: true, status: 201, vote };
}

export async function saveTeam(input: Omit<Team, "id"> & { id?: string }) {
  const data = await readData();
  const id = input.id || crypto.randomUUID();
  const team: Team = { ...input, id };
  const index = data.teams.findIndex((item) => item.id === id);

  if (index >= 0) {
    data.teams[index] = team;
  } else {
    data.teams.push(team);
  }

  await writeData(data);
  return team;
}

export async function deleteTeam(teamId: string) {
  const data = await readData();
  data.teams = data.teams.filter((team) => team.id !== teamId);
  data.votes = data.votes.filter((vote) => vote.teamId !== teamId);
  await writeData(data);
}

export async function setEventStatus(eventId: string, status: "open" | "closed") {
  const data = await readData();
  data.events = data.events.map((event) => (event.id === eventId ? { ...event, status } : event));
  await writeData(data);
}

export async function resetVotes(eventId: string) {
  const data = await readData();
  data.votes = data.votes.filter((vote) => vote.eventId !== eventId);
  await writeData(data);
}
