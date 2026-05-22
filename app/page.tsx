"use client";

import { SiteShell } from "@/components/site-shell";
import { useEventSnapshot } from "@/components/use-event-snapshot";
import { getLockedVote, getVoterKey, lockVote } from "@/lib/voter";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const eventId = "startup-sprint-2026";

export default function VotingPage() {
  const { snapshot, loading, error, refresh } = useEventSnapshot(eventId);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [lockedTeam, setLockedTeam] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState("");

  useEffect(() => {
    setLockedTeam(getLockedVote(eventId));
  }, []);

  async function submitVote(teamId: string) {
    if (submitting || lockedTeam) {
      return;
    }

    setSubmitting(teamId);
    setMessage("");

    try {
      const response = await fetch(`/api/events/${eventId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, voterKey: getVoterKey() })
      });

      const data = await response.json();

      if (response.ok) {
        lockVote(eventId, teamId);
        setLockedTeam(teamId);
        setSelectedTeam(null);
        setMessage("Your vote has been successfully submitted.");
        await refresh();
      } else {
        setMessage(data.message || "Unable to submit vote.");
        if (response.status === 409) {
          setLockedTeam(teamId);
        }
      }
    } catch (caught) {
      setMessage("A network error occurred. Please try again.");
    } finally {
      setSubmitting("");
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-6xl gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div className="flex flex-col justify-center">
          <div className="mb-4 w-fit rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
            Inspire India Founder Circle
          </div>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Vote for the founder building the next big idea.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Review every team, pick your favourite, and watch the leaderboard update during the event.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:flex">
            <div className="glass rounded-2xl px-5 py-4">
              <div className="text-3xl font-bold">{snapshot?.teams.length || 0}</div>
              <div className="text-sm text-slate-500">Teams</div>
            </div>
            <div className="glass rounded-2xl px-5 py-4">
              <div className="text-3xl font-bold">{snapshot?.totalVotes || 0}</div>
              <div className="text-sm text-slate-500">Votes cast</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <h2 className="text-xl font-bold">Teams</h2>
              <p className="text-sm text-slate-500">{snapshot?.event.status === "open" ? "Voting is open" : "Voting is closed"}</p>
            </div>
            <Trophy className="text-orange-600" />
          </div>

          {loading && <div className="rounded-3xl bg-white p-6 text-slate-500">Loading teams...</div>}
          {error && <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</div>}

          <div className="space-y-3">
            {snapshot?.teams.map((team, index) => {
              const voted = lockedTeam === team.id;
              const disabled = Boolean(lockedTeam) || snapshot.event.status !== "open";

              return (
                <motion.article
                  key={team.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white" style={{ background: team.color }}>
                      {team.startupName.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-500">{team.teamName}</div>
                      <h3 className="text-2xl font-bold tracking-tight">{team.startupName}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{team.description}</p>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{team.members.join(" / ")}</p>
                    </div>
                  </div>

                  <button
                    disabled={disabled || submitting === team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    {submitting === team.id && <Loader2 className="animate-spin" size={17} />}
                    {voted && <Check size={17} />}
                    {voted ? "Vote submitted" : disabled ? "Voting unavailable" : "Vote for this team"}
                  </button>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedTeam && snapshot && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
            >
              <h3 className="text-2xl font-bold">Confirm your vote?</h3>
              <p className="mt-2 text-slate-600">
                You can vote once. Your choice will be locked for this event.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="h-12 rounded-2xl bg-slate-100 font-semibold" onClick={() => setSelectedTeam(null)}>
                  Cancel
                </button>
                <button
                  className="h-12 rounded-2xl bg-orange-600 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={Boolean(submitting)}
                  onClick={() => submitVote(selectedTeam)}
                >
                  {submitting ? "Submitting" : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div
            className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-4 text-center font-semibold text-white shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </SiteShell>
  );
}
