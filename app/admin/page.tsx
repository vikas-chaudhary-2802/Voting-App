"use client";

import { SiteShell } from "@/components/site-shell";
import { useEventSnapshot } from "@/components/use-event-snapshot";
import { TeamWithVotes } from "@/lib/types";
import { Check, Copy, Plus, Power, RefreshCcw, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const eventId = "startup-sprint-2026";
const emptyForm = {
  id: "",
  teamName: "",
  startupName: "",
  description: "",
  members: "",
  color: "#ff6b00"
};

export default function AdminPage() {
  const { snapshot, loading, error, refresh } = useEventSnapshot(eventId);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [votingLink, setVotingLink] = useState("/");

  useEffect(() => {
    setVotingLink(`${window.location.origin}/`);
  }, []);

  function editTeam(team: TeamWithVotes) {
    setForm({
      id: team.id,
      teamName: team.teamName,
      startupName: team.startupName,
      description: team.description,
      members: team.members.join(", "),
      color: team.color
    });
  }

  async function submitTeam(event: FormEvent) {
    event.preventDefault();
    setBusy("save");
    setActionError("");
    setActionMessage("");

    const response = await fetch(`/api/admin/${eventId}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        id: form.id || undefined,
        members: form.members
          .split(",")
          .map((member) => member.trim())
          .filter(Boolean)
      })
    });

    if (!response.ok) {
      const data = await response.json();
      setActionError(data.message || "Unable to save team.");
      setBusy("");
      return;
    }

    setForm(emptyForm);
    setActionMessage("Team saved.");
    setBusy("");
    await refresh();
  }

  async function deleteSelectedTeam(teamId: string) {
    setBusy(teamId);
    setActionError("");
    setActionMessage("");

    const response = await fetch(`/api/admin/${eventId}/teams/${teamId}`, { method: "DELETE" });

    if (!response.ok) {
      const data = await response.json();
      setActionError(data.message || "Unable to delete team.");
      setBusy("");
      return;
    }

    setActionMessage("Team deleted.");
    setBusy("");
    await refresh();
  }

  async function updateStatus(status: "open" | "closed") {
    setBusy("status");
    setActionError("");
    setActionMessage("");

    const response = await fetch(`/api/admin/${eventId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const data = await response.json();
      setActionError(data.message || "Unable to update voting status.");
      setBusy("");
      return;
    }

    setActionMessage(`Voting ${status === "open" ? "opened" : "closed"}.`);
    setBusy("");
    await refresh();
  }

  async function resetAllVotes() {
    setBusy("reset");
    setActionError("");
    setActionMessage("");

    const response = await fetch(`/api/admin/${eventId}/reset`, { method: "POST" });

    if (!response.ok) {
      const data = await response.json();
      setActionError(data.message || "Unable to reset votes.");
      setBusy("");
      return;
    }

    setActionMessage("Votes reset.");
    setBusy("");
    await refresh();
  }

  async function copyVotingLink() {
    setActionError("");
    setActionMessage("");

    try {
      await navigator.clipboard.writeText(votingLink);
      setActionMessage("Voting link copied.");
    } catch {
      setActionError("Copy failed. Select the voting link and copy it manually.");
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-6xl gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-16">
        <div>
          <div className="mb-3 w-fit rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
            Admin dashboard
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Run Founder Circle voting.</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
            Add teams, open or close voting, reset votes, and share the attendee link.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="glass rounded-3xl p-5">
              <div className="text-3xl font-bold">{snapshot?.teams.length || 0}</div>
              <div className="text-sm text-slate-500">Teams</div>
            </div>
            <div className="glass rounded-3xl p-5">
              <div className="text-3xl font-bold">{snapshot?.totalVotes || 0}</div>
              <div className="text-sm text-slate-500">Votes</div>
            </div>
            <div className="glass rounded-3xl p-5">
              <div className="text-3xl font-bold capitalize">{snapshot?.event.status || "open"}</div>
              <div className="text-sm text-slate-500">Status</div>
            </div>
          </div>

          <div className="glass mt-6 rounded-3xl p-4">
            <div className="mb-2 text-sm font-semibold text-slate-500">Voting link</div>
            <div className="flex gap-2">
              <input readOnly value={votingLink} className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none" />
              <button
                className="grid size-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white"
                onClick={copyVotingLink}
                title="Copy voting link"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="flex h-12 items-center gap-2 rounded-2xl bg-orange-600 px-4 font-semibold text-white disabled:opacity-60"
              onClick={() => updateStatus(snapshot?.event.status === "open" ? "closed" : "open")}
              disabled={busy === "status"}
            >
              <Power size={18} />
              {snapshot?.event.status === "open" ? "Close voting" : "Open voting"}
            </button>
            <button
              className="flex h-12 items-center gap-2 rounded-2xl bg-white px-4 font-semibold text-slate-950 shadow-sm disabled:opacity-60"
              onClick={resetAllVotes}
              disabled={busy === "reset"}
            >
              <RefreshCcw size={18} />
              Reset votes
            </button>
          </div>

          {(actionError || actionMessage) && (
            <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${actionError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {actionError || actionMessage}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <form className="glass rounded-[2rem] p-5" onSubmit={submitTeam}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{form.id ? "Edit team" : "Add team"}</h2>
              <button type="submit" className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-white disabled:opacity-60" title="Save team" disabled={busy === "save"}>
                {form.id ? <Check size={18} /> : <Plus size={18} />}
              </button>
            </div>
            <div className="grid gap-3">
              <input required placeholder="Team name" value={form.teamName} onChange={(event) => setForm({ ...form, teamName: event.target.value })} className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-orange-500" />
              <input required placeholder="Startup idea name" value={form.startupName} onChange={(event) => setForm({ ...form, startupName: event.target.value })} className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-orange-500" />
              <textarea required placeholder="Short pitch summary" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500" />
              <input placeholder="Team members, comma separated" value={form.members} onChange={(event) => setForm({ ...form, members: event.target.value })} className="h-12 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-orange-500" />
              <input type="color" aria-label="Team color" value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })} className="h-12 w-full rounded-2xl border border-slate-200 bg-white p-2" />
            </div>
          </form>

          <div className="glass rounded-[2rem] p-5">
            <h2 className="mb-4 text-2xl font-bold">Teams</h2>
            {loading && <div className="text-slate-500">Loading...</div>}
            {error && <div className="text-red-700">{error}</div>}
            <div className="space-y-3">
              {snapshot?.teams.map((team) => (
                <div key={team.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="size-4 shrink-0 rounded-full" style={{ background: team.color }} />
                    <button className="min-w-0 flex-1 text-left" onClick={() => editTeam(team)}>
                      <div className="font-bold">{team.startupName}</div>
                      <div className="text-sm text-slate-500">{team.teamName} · {team.votes} votes</div>
                    </button>
                    <button
                      className="grid size-10 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"
                      onClick={() => deleteSelectedTeam(team.id)}
                      disabled={busy === team.id}
                      title="Delete team"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
