"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useMemo, useState } from "react";

export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  const [query, setQuery] = useState("");
  const helperText = useMemo(() => {
    if (!query.trim()) return "Search students, labs, computers...";
    return `Searching for “${query.trim()}”`;
  }, [query]);

  return (
    <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-start gap-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-dashboard-sidebar"))}
          className="rounded-2xl border border-brand-100 bg-white p-3 shadow-soft transition hover:-translate-y-0.5 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5 text-brand-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3 shadow-soft sm:min-w-[290px]">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search students, labs, computers..."
            className="w-full min-w-0 border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>
        <button className="rounded-2xl border border-brand-100 bg-white p-3 shadow-soft transition hover:-translate-y-0.5" aria-label="Notifications">
          <Bell className="h-5 w-5 text-brand-700" />
        </button>
      </div>

      <p className="text-sm text-slate-400 xl:hidden">{helperText}</p>
    </div>
  );
}
