"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Building2, FileBarChart2, LayoutDashboard, MonitorSmartphone, Settings, ShieldCheck, Users2, X } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/laboratories", label: "Laboratories", icon: Building2 },
  { href: "/sessions", label: "Active Sessions", icon: Activity },
  { href: "/users", label: "Users", icon: Users2 },
  { href: "/reports", label: "Reports", icon: FileBarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col rounded-[28px] bg-gradient-to-b from-brand-700 via-brand-800 to-brand-950 p-5 text-white shadow-soft">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <MonitorSmartphone className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold">Philippine Christian University</p>
            <p className="text-xs text-white/70">Computer Lab Management System</p>
          </div>
        </div>
        {mobile ? (
          <button onClick={onNavigate} className="rounded-2xl border border-white/10 bg-white/10 p-2 lg:hidden" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="mb-8 rounded-2xl border border-white/10 bg-white/10 p-4">
        <p className="text-sm text-white/70">Welcome back</p>
        <h2 className="mt-1 text-xl font-semibold">Admin Cardo Dalisay</h2>
        <p className="mt-2 text-xs text-white/70">System Status: Online</p>
      </div>

      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={clsx(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                active ? "bg-white text-brand-800 shadow-soft" : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/10 bg-white/10 p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-brand-200" />
          <div>
            <p className="text-sm font-medium">Privacy & Security</p>
            <p className="text-xs text-white/70">Audit logs enabled</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
