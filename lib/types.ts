export type EventStatus = "open" | "closed";

export type Team = {
  id: string;
  eventId: string;
  teamName: string;
  startupName: string;
  description: string;
  members: string[];
  color: string;
};

export type Vote = {
  id: string;
  eventId: string;
  teamId: string;
  voterKey: string;
  createdAt: string;
};

export type SprintEvent = {
  id: string;
  name: string;
  tagline: string;
  date: string;
  status: EventStatus;
};

export type AppData = {
  events: SprintEvent[];
  teams: Team[];
  votes: Vote[];
};

export type TeamWithVotes = Team & {
  votes: number;
  percentage: number;
};

export type EventSnapshot = {
  event: SprintEvent;
  teams: TeamWithVotes[];
  totalVotes: number;
};
