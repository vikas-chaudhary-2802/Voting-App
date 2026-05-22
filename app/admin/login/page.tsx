"use client";

import { SiteShell } from "@/components/site-shell";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        router.push("/admin");
        router.refresh(); // Refresh to update middleware state
      } else {
        const data = await response.json();
        setError(data.message || "Invalid password.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <section className="mx-auto flex max-w-md flex-col items-center justify-center py-20 lg:py-32">
        <div className="mb-6 grid size-16 place-items-center rounded-full bg-orange-100 text-orange-600 shadow-sm">
          <Lock size={28} />
        </div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Admin Access</h1>
        <p className="mb-8 text-center text-slate-500">
          Enter the master password to manage the voting dashboard.
        </p>

        <form onSubmit={handleLogin} className="glass w-full rounded-[2rem] p-6 shadow-xl">
          <div className="grid gap-4">
            <input
              type="email"
              required
              placeholder="Enter master email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-lg outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
            <input
              type="password"
              required
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 rounded-2xl border border-slate-200 bg-white px-5 text-lg outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
            />
            {error && <div className="text-sm font-medium text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 text-lg font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Log In"}
            </button>
          </div>
        </form>
      </section>
    </SiteShell>
  );
}
