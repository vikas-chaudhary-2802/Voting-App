"use client";

import { SiteShell } from "@/components/site-shell";
import { useEventSnapshot } from "@/components/use-event-snapshot";
import { motion } from "framer-motion";
import { Medal, Trophy } from "lucide-react";

const eventId = "startup-sprint-2026";

export default function LeaderboardPage() {
  const { snapshot, loading, error } = useEventSnapshot(eventId, 1000);
  const leader = snapshot?.teams[0];

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl py-10 lg:py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 w-fit rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
              Live leaderboard
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{snapshot?.event.name || "Inspire India Founder Circle"}</h1>
          </div>
          <div className="glass rounded-3xl px-6 py-4">
            <div className="text-4xl font-bold">{snapshot?.totalVotes || 0}</div>
            <div className="text-sm text-slate-500">Total votes</div>
          </div>
        </div>

        {leader && (
          <div className="mb-5 rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
            <div className="flex items-center gap-3 text-orange-200">
              <Trophy size={22} />
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">Current leader</span>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-lg text-white/60">{leader.teamName}</p>
                <h2 className="text-5xl font-bold tracking-tight sm:text-7xl">{leader.startupName}</h2>
              </div>
              <div className="text-5xl font-bold text-orange-400">{leader.votes}</div>
            </div>
          </div>
        )}

        {loading && <div className="glass rounded-3xl p-6 text-slate-500">Loading rankings...</div>}
        {error && <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</div>}

        <div className="space-y-4">
          {snapshot?.teams.map((team, index) => (
            <motion.div
              layout
              key={team.id}
              className="glass rounded-3xl p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-4 flex items-center gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white font-bold shadow-sm">
                  {index === 0 ? <Medal className="text-orange-600" size={22} /> : index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-500">{team.teamName}</div>
                  <div className="truncate text-2xl font-bold">{team.startupName}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{team.votes}</div>
                  <div className="text-xs text-slate-500">{team.percentage}%</div>
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: team.color }}
                  animate={{ width: `${team.percentage}%` }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
