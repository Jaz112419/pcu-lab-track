"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionCard } from "@/components/cards";
import { DataTable, StatusBadge } from "@/components/tables";
import { Topbar } from "@/components/topbar";
import { activeSessions as initialActiveSessions } from "@/lib/data";
import { AppButton, Notification, Select } from "@/components/ui";

type SessionRow = (typeof initialActiveSessions)[number] & {
  building?: string;
  laboratoryNumber?: string;
  section?: string;
};

const PAGE_SIZE = 5;

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionRow[]>(initialActiveSessions);
  const [selectedStudentId, setSelectedStudentId] = useState(
    initialActiveSessions[0]?.studentId ?? ""
  );
  const [notice, setNotice] = useState("");

  const [buildingFilter, setBuildingFilter] = useState("All");
  const [laboratoryFilter, setLaboratoryFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");

  const [detailsBuildingFilter, setDetailsBuildingFilter] = useState("All");
  const [detailsLaboratoryFilter, setDetailsLaboratoryFilter] = useState("All");
  const [detailsSectionFilter, setDetailsSectionFilter] = useState("All");
  const [studentSearch, setStudentSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const buildingOptions = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(sessions.map((session) => session.building).filter(Boolean))
      ),
    ];
  }, [sessions]);

  const laboratoryOptions = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          sessions.map((session) => session.laboratoryNumber).filter(Boolean)
        )
      ),
    ];
  }, [sessions]);

  const sectionOptions = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(sessions.map((session) => session.section).filter(Boolean))
      ),
    ];
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesBuilding =
        buildingFilter === "All" || session.building === buildingFilter;
      const matchesLaboratory =
        laboratoryFilter === "All" ||
        session.laboratoryNumber === laboratoryFilter;
      const matchesSection =
        sectionFilter === "All" || session.section === sectionFilter;

      return matchesBuilding && matchesLaboratory && matchesSection;
    });
  }, [sessions, buildingFilter, laboratoryFilter, sectionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / PAGE_SIZE));

  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSessions.slice(start, start + PAGE_SIZE);
  }, [filteredSessions, currentPage]);

  const detailFilteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesBuilding =
        detailsBuildingFilter === "All" ||
        session.building === detailsBuildingFilter;
      const matchesLaboratory =
        detailsLaboratoryFilter === "All" ||
        session.laboratoryNumber === detailsLaboratoryFilter;
      const matchesSection =
        detailsSectionFilter === "All" ||
        session.section === detailsSectionFilter;

      const searchValue = studentSearch.trim().toLowerCase();
      const matchesSearch =
        searchValue === "" ||
        session.student.toLowerCase().includes(searchValue) ||
        session.studentId.toLowerCase().includes(searchValue);

      return (
        matchesBuilding &&
        matchesLaboratory &&
        matchesSection &&
        matchesSearch
      );
    });
  }, [
    sessions,
    detailsBuildingFilter,
    detailsLaboratoryFilter,
    detailsSectionFilter,
    studentSearch,
  ]);

  const selectedSession = useMemo(
    () =>
      detailFilteredSessions.find(
        (session) => session.studentId === selectedStudentId
      ) ?? detailFilteredSessions[0],
    [selectedStudentId, detailFilteredSessions]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [buildingFilter, laboratoryFilter, sectionFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (
      selectedSession &&
      selectedStudentId !== selectedSession.studentId
    ) {
      setSelectedStudentId(selectedSession.studentId);
    }

    if (!selectedSession && detailFilteredSessions.length === 0) {
      setSelectedStudentId("");
    }
  }, [selectedSession, selectedStudentId, detailFilteredSessions]);

  const extendTime = () => {
    if (!selectedSession) return;

    const usageValue = Number.parseInt(selectedSession.usage, 10) || 0;
    const remainingValue = Number.parseInt(selectedSession.remaining, 10) || 0;

    setSessions((current) =>
      current.map((session) =>
        session.studentId === selectedSession.studentId
          ? {
              ...session,
              usage: `${usageValue} min`,
              remaining: `${remainingValue + 15} min`,
              status: "Active",
            }
          : session
      )
    );

    setNotice(`${selectedSession.student} received a 15-minute extension.`);
  };

  const forceLogout = () => {
    if (!selectedSession) return;

    setSessions((current) =>
      current.filter(
        (session) => session.studentId !== selectedSession.studentId
      )
    );

    setSelectedStudentId("");
    setNotice(`${selectedSession.student} was logged out successfully.`);
  };

  return (
    <div>
      <Topbar
        title="Active Sessions"
        subtitle="Handle current lab sessions, time extensions, and forced logouts."
      />

      {notice ? (
        <Notification message={notice} onClose={() => setNotice("")} />
      ) : null}

      <div className="space-y-6">
        <SectionCard
          title="Current Active Sessions"
          action="Export"
          onAction={() =>
            setNotice("Session export is ready in this frontend demo.")
          }
        >
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <Select
              value={buildingFilter}
              onChange={(event) => setBuildingFilter(event.target.value)}
            >
              {buildingOptions.map((building) => (
                <option key={building} value={building}>
                  {building === "All" ? "All Buildings" : building}
                </option>
              ))}
            </Select>

            <Select
              value={laboratoryFilter}
              onChange={(event) => setLaboratoryFilter(event.target.value)}
            >
              {laboratoryOptions.map((lab) => (
                <option key={lab} value={lab}>
                  {lab === "All" ? "All Laboratory Numbers" : lab}
                </option>
              ))}
            </Select>

            <Select
              value={sectionFilter}
              onChange={(event) => setSectionFilter(event.target.value)}
            >
              {sectionOptions.map((section) => (
                <option key={section} value={section}>
                  {section === "All" ? "All Sections" : section}
                </option>
              ))}
            </Select>
          </div>

          <DataTable
            columns={[
              { key: "student", label: "Student" },
              { key: "studentId", label: "Student ID" },
              { key: "building", label: "Building" },
              { key: "laboratoryNumber", label: "Laboratory Number" },
              { key: "section", label: "Section" },
              { key: "computer", label: "Computer" },
              { key: "loginTime", label: "Login Time" },
              { key: "usage", label: "Usage Time" },
              { key: "remaining", label: "Remaining" },
              {
                key: "status",
                label: "Status",
                render: (value) => <StatusBadge value={String(value)} />,
              },
            ]}
            data={paginatedSessions}
          />

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              {filteredSessions.length === 0
                ? 0
                : (currentPage - 1) * PAGE_SIZE + 1}
              -
              {Math.min(currentPage * PAGE_SIZE, filteredSessions.length)} of{" "}
              {filteredSessions.length} sessions
            </p>

            <div className="flex gap-2">
              <AppButton
                className="w-full sm:w-auto"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </AppButton>
              <AppButton
                className="w-full sm:w-auto"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </AppButton>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Session Details">
          <div className="space-y-4 text-sm text-slate-600">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Select
                value={detailsBuildingFilter}
                onChange={(event) => setDetailsBuildingFilter(event.target.value)}
              >
                {buildingOptions.map((building) => (
                  <option key={building} value={building}>
                    {building === "All" ? "All Buildings" : building}
                  </option>
                ))}
              </Select>

              <Select
                value={detailsLaboratoryFilter}
                onChange={(event) =>
                  setDetailsLaboratoryFilter(event.target.value)
                }
              >
                {laboratoryOptions.map((lab) => (
                  <option key={lab} value={lab}>
                    {lab === "All" ? "All Laboratory Numbers" : lab}
                  </option>
                ))}
              </Select>

              <Select
                value={detailsSectionFilter}
                onChange={(event) => setDetailsSectionFilter(event.target.value)}
              >
                {sectionOptions.map((section) => (
                  <option key={section} value={section}>
                    {section === "All" ? "All Sections" : section}
                  </option>
                ))}
              </Select>

              <input
                type="text"
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
                placeholder="Search student or ID"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-brand-500"
              />
            </div>

            <div className="max-w-md">
              <Select
                value={selectedSession?.studentId ?? ""}
                onChange={(event) => setSelectedStudentId(event.target.value)}
              >
                {detailFilteredSessions.map((session) => (
                  <option key={session.studentId} value={session.studentId}>
                    {session.student} ({session.studentId})
                  </option>
                ))}
              </Select>
            </div>

            {selectedSession ? (
              <>
                <div className="rounded-2xl bg-brand-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-700">
                    Selected Session
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    {selectedSession.student}
                  </h3>
                  <p className="mt-1">Student ID: {selectedSession.studentId}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Info label="Building" value={selectedSession.building ?? "-"} />
                  <Info
                    label="Laboratory Number"
                    value={selectedSession.laboratoryNumber ?? "-"}
                  />
                  <Info label="Section" value={selectedSession.section ?? "-"} />
                  <Info label="Computer" value={selectedSession.computer} />
                  <Info label="Lab" value={selectedSession.lab} />
                  <Info label="Login Time" value={selectedSession.loginTime} />
                  <Info label="Usage Time" value={selectedSession.usage} />
                  <Info label="Time Remaining" value={selectedSession.remaining} />
                  <Info label="Status" value={selectedSession.status} />
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <AppButton className="w-full sm:w-auto" onClick={extendTime}>
                    Extend Time (+15 min)
                  </AppButton>
                  <AppButton
                    variant="danger"
                    className="w-full sm:w-auto"
                    onClick={forceLogout}
                  >
                    Force Logout
                  </AppButton>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                No active session selected.
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 font-medium text-slate-800">{value}</p>
    </div>
  );
}