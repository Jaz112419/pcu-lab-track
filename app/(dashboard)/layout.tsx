"use client";

import { Sidebar } from "@/components/sidebar";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    const openSidebar = () => setSidebarOpen(true);
    window.addEventListener("resize", closeOnResize);
    window.addEventListener("open-dashboard-sidebar", openSidebar as EventListener);
    return () => {
      window.removeEventListener("resize", closeOnResize);
      window.removeEventListener("open-dashboard-sidebar", openSidebar as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1600px] grid-cols-1 gap-6 lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button className="absolute inset-0 bg-slate-950/40" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar overlay" />
            <div className="relative h-full max-w-[320px] p-3">
              <Sidebar mobile onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        ) : null}

        <main className="rounded-[32px] bg-white/45 p-4 backdrop-blur md:p-6">{children}</main>
      </div>
    </div>
  );
}
