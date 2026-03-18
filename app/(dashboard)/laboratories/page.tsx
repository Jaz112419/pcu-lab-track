"use client";

import { useMemo, useState } from "react";
import { SectionCard, SummaryCard } from "@/components/cards";
import { DataTable, StatusBadge } from "@/components/tables";
import { Topbar } from "@/components/topbar";
import { labs } from "@/lib/data";
import { Notification, Select } from "@/components/ui";

const computers = [
  { unit: "PC-01", status: "Available", student: "—", lab: "Lab A" },
  { unit: "PC-02", status: "In Use", student: "2023-0012", lab: "Lab A" },
  { unit: "PC-03", status: "In Use", student: "2023-0021", lab: "Lab A" },
  { unit: "PC-04", status: "Maintenance", student: "—", lab: "Lab A" },
  { unit: "PC-05", status: "Available", student: "—", lab: "Lab A" },
  { unit: "PC-11", status: "In Use", student: "2023-0048", lab: "Lab B" },
];

export default function LaboratoriesPage() {
  const [selectedLab, setSelectedLab] = useState("Lab A");
  const [notice, setNotice] = useState("");

  const filteredComputers = useMemo(
    () => computers.filter((computer) => computer.lab === selectedLab),
    [selectedLab]
  );

  const selectedLabInfo = useMemo(
    () => labs.find((lab) => lab.name === selectedLab),
    [selectedLab]
  );

  return (
    <div className="space-y-6">
      <Topbar
        title="Laboratories"
        subtitle="See room capacity, availability, and real-time computer monitoring."
      />

      {notice ? (
        <Notification message={notice} onClose={() => setNotice("")} />
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {labs.map((lab, index) => (
          <SummaryCard
            key={lab.id}
            title={lab.name}
            value={`${lab.inUse}/${lab.capacity}`}
            helper={`${lab.location} • ${lab.status}`}
            highlighted={index === 0}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Laboratories Overview">
          <div className="overflow-x-auto">
            <DataTable
              columns={[
                { key: "name", label: "Laboratory" },
                { key: "location", label: "Location" },
                { key: "capacity", label: "Capacity" },
                { key: "inUse", label: "In Use" },
                {
                  key: "status",
                  label: "Status",
                  render: (value) => <StatusBadge value={String(value)} />,
                },
              ]}
              data={labs}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Real-Time Monitor"
          action="Refresh Status"
          onAction={() =>
            setNotice(`${selectedLab} status refreshed successfully.`)
          }
        >
          <div className="space-y-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Selected Laboratory
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {selectedLab}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {selectedLabInfo
                      ? `${selectedLabInfo.location} • ${selectedLabInfo.status}`
                      : "No lab information available"}
                  </p>
                </div>

                <div className="w-full lg:w-[260px]">
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Change Laboratory
                  </label>
                  <Select
                    value={selectedLab}
                    onChange={(event) => setSelectedLab(event.target.value)}
                    className="w-full"
                  >
                    {labs.map((lab) => (
                      <option key={lab.id} value={lab.name}>
                        {lab.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {selectedLabInfo ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoCard label="Capacity" value={String(selectedLabInfo.capacity)} />
                  <InfoCard label="Currently In Use" value={String(selectedLabInfo.inUse)} />
                  <InfoCard label="Available Units" value={String(selectedLabInfo.capacity - selectedLabInfo.inUse)} />
                </div>
              ) : null}
            </div>

            <div>
              <div className="mb-3">
                <h4 className="text-base font-semibold text-slate-900">
                  Computer Status
                </h4>
                <p className="text-sm text-slate-500">
                  Live unit availability and current student assignment.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {filteredComputers.map((computer) => (
                  <div
                    key={computer.unit}
                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {computer.unit}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {computer.lab}
                        </p>
                      </div>
                      <StatusBadge value={computer.status} />
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-400">Assigned Student</span>
                        <span className="font-medium text-slate-700">
                          {computer.student}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {!filteredComputers.length ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                    No computer activity found for this laboratory yet.
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}