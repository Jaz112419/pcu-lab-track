"use client";

import { useState } from "react";
import { SectionCard } from "@/components/cards";
import { Topbar } from "@/components/topbar";
import { AppButton, Notification, Select } from "@/components/ui";

export default function SettingsPage() {
  const [autoLogout, setAutoLogout] = useState("Yes");
  const [inactivityLimit, setInactivityLimit] = useState("10 minutes");
  const [notice, setNotice] = useState("");

  return (
    <div>
      <Topbar title="System Settings" subtitle="Configure inactivity rules, auto logout, and admin-side monitoring preferences." />
      {notice ? <Notification message={notice} onClose={() => setNotice("")} /> : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Inactivity Rule" action="Save Changes" onAction={() => setNotice(`Settings saved. Auto logout: ${autoLogout}, inactivity limit: ${inactivityLimit}.`)}>
          <div className="space-y-5">
            <ConfigField label="Auto Logout Enabled">
              <Select value={autoLogout} onChange={(event) => setAutoLogout(event.target.value)}>
                <option>Yes</option>
                <option>No</option>
              </Select>
            </ConfigField>
            <ConfigField label="Inactivity Limit">
              <Select value={inactivityLimit} onChange={(event) => setInactivityLimit(event.target.value)}>
                <option>5 minutes</option>
                <option>10 minutes</option>
                <option>15 minutes</option>
              </Select>
            </ConfigField>
            <Field label="One Active Session per User" value="Enabled" />
            <Field label="One Active Session per Computer" value="Enabled" />
          </div>
        </SectionCard>

        <SectionCard title="Business Rule Enforcement">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "One active session per user",
              "One active session per computer",
              "Auto lock computer after logout",
              "All overrides logged",
              "Attendance auto-calculated",
              "Real-time updates via WebSockets",
            ].map((rule) => (
              <div key={rule} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                {rule}
              </div>
            ))}
          </div>
          <AppButton variant="secondary" className="mt-4 w-full sm:w-auto" onClick={() => setNotice("Business rule checklist reviewed successfully.")}>Review Rules</AppButton>
        </SectionCard>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function ConfigField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <p className="mb-3 text-sm text-slate-400">{label}</p>
      {children}
    </div>
  );
}
