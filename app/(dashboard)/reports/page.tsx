"use client";

import { useState } from "react";
import { SectionCard, SummaryCard } from "@/components/cards";
import { DataTable, StatusBadge } from "@/components/tables";
import { Topbar } from "@/components/topbar";
import { AppButton, Notification } from "@/components/ui";

const reportRows = [
  { student: "Allyssa Mae De Leon", totalSessions: 18, totalMinutes: 920, average: "51 min", status: "Active" },
  { student: "Jazmin Nicole Dela Fuente", totalSessions: 12, totalMinutes: 510, average: "42 min", status: "Active" },
  { student: "Caila Torres", totalSessions: 15, totalMinutes: 770, average: "51 min", status: "Idle warning" },
  { student: "Nomer Ropero", totalSessions: 11, totalMinutes: 485, average: "44 min", status: "Active" },
];

const exportActions = ["PDF", "Excel", "CSV"];
const reportSummary = [
  { label: "Most Used Lab", value: "Lab A", note: "Highest student traffic today" },
  { label: "Top Student", value: "Jane Smith", note: "18 completed sessions" },
  { label: "Average Session", value: "47 min", note: "Based on January records" },
];

export default function ReportsPage() {
  const [notice, setNotice] = useState("");

  return (
    <div>
      <Topbar title="Reports Module" subtitle="View laboratory usage records, export files, and monitor attendance without charts." />
      {notice ? <Notification message={notice} onClose={() => setNotice("")} /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Monthly Sessions" value="56" helper="January total completed sessions" highlighted />
        <SummaryCard title="Minutes Used" value="2,685" helper="Total minutes consumed this month" />
        <SummaryCard title="Export Options" value="3" helper="PDF, Excel, CSV" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Usage Summary">
          <div className="grid gap-4 md:grid-cols-3">
            {reportSummary.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-3 text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Export Actions">
          <div className="grid gap-4 md:grid-cols-3">
            {exportActions.map((item) => (
              <AppButton key={item} variant="secondary" className="px-6 py-10 text-base" onClick={() => setNotice(`${item} export was prepared successfully.`)}>
                Export {item}
              </AppButton>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Usage Report - January">
          <DataTable
            columns={[
              { key: "student", label: "Student" },
              { key: "totalSessions", label: "Total Sessions" },
              { key: "totalMinutes", label: "Total Minutes Used" },
              { key: "average", label: "Average Time" },
              { key: "status", label: "Status", render: (value) => <StatusBadge value={String(value)} /> },
            ]}
            data={reportRows}
          />
        </SectionCard>
      </div>
    </div>
  );
}
