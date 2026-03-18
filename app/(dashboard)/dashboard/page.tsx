"use client";

import { useState } from "react";
import { SectionCard, SummaryCard } from "@/components/cards";
import { DataTable, StatusBadge } from "@/components/tables";
import { Topbar } from "@/components/topbar";
import { activeSessions, auditLogs, labs, summaryCards } from "@/lib/data";
import { Notification } from "@/components/ui";

const quickStats = [
  { label: "Available Computers", value: "74", helper: "Ready for student login" },
  { label: "Under Maintenance", value: "2", helper: "Scheduled for repair" },
  { label: "Peak Lab", value: "Lab A", helper: "28 computers in use" },
];

export default function DashboardPage() {
  const [notice, setNotice] = useState("");

  return (
    <div>
      <Topbar title="Admin Dashboard" subtitle="Monitor laboratories, student sessions, reports, and system activity in one place." />
      {notice ? <Notification message={notice} onClose={() => setNotice("")} /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => (
          <SummaryCard key={card.title} {...card} highlighted={index === 0} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title="System Snapshot">
          <div className="grid gap-4 md:grid-cols-3">
            {quickStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Audit Logs" action="View All" onAction={() => setNotice("All audit logs are already visible in this demo dashboard.") }>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={`${log.user}-${log.time}`} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{log.user}</p>
                    <p className="text-sm text-slate-500">{log.action} on {log.entity}</p>
                  </div>
                  <span className="text-xs text-slate-400">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Laboratories Overview" action="View Laboratories" onAction={() => setNotice("Laboratory details are loaded in the Laboratories page.") }>
          <DataTable
            columns={[
              { key: "name", label: "Lab" },
              { key: "location", label: "Location" },
              { key: "capacity", label: "Capacity" },
              { key: "inUse", label: "In Use" },
              { key: "status", label: "Status", render: (value) => <StatusBadge value={String(value)} /> },
            ]}
            data={labs}
          />
        </SectionCard>

        <SectionCard title="Session Summary">
          <div className="space-y-4">
            {activeSessions.slice(0, 4).map((session) => (
              <div key={session.studentId} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{session.student}</p>
                    <p className="mt-1 text-sm text-slate-500">{session.studentId} • {session.computer} • {session.lab}</p>
                  </div>
                  <StatusBadge value={String(session.status)} />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>Usage: {session.usage}</span>
                  <span>Remaining: {session.remaining}</span>
                  <span>Login: {session.loginTime}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Active Sessions" action="Manage Sessions" onAction={() => setNotice("Use the Active Sessions page to extend time or force logout.") }>
          <DataTable
            columns={[
              { key: "student", label: "Student" },
              { key: "studentId", label: "Student ID" },
              { key: "computer", label: "Computer" },
              { key: "lab", label: "Laboratory" },
              { key: "usage", label: "Usage Time" },
              { key: "remaining", label: "Time Remaining" },
              { key: "status", label: "Status", render: (value) => <StatusBadge value={String(value)} /> },
            ]}
            data={activeSessions}
          />
        </SectionCard>
      </div>
    </div>
  );
}
