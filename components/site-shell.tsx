import Link from "next/link";
import { BarChart3, Shield } from "lucide-react";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-4 text-slate-950 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
        <Link className="flex min-w-0 items-center gap-2 text-sm font-semibold" href="/">
          <img
            alt="Inspire India Founder Circle logo"
            className="size-9 shrink-0 rounded-full object-cover"
            src="/inspire-logo.png"
          />
          <span className="truncate">Inspire India Founder Circle</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" href="/leaderboard">
            <span className="hidden sm:inline">Leaderboard</span>
            <BarChart3 className="sm:hidden" size={18} />
          </Link>
          <Link className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950" href="/admin">
            <span className="hidden sm:inline">Admin</span>
            <Shield className="sm:hidden" size={18} />
          </Link>
        </div>
      </nav>
      {children}
    </main>
  );
}
