"use client";

import { useMemo, useRef, useState } from "react";
import { SectionCard } from "@/components/cards";
import { DataTable, StatusBadge } from "@/components/tables";
import { Topbar } from "@/components/topbar";
import { users as initialUsers } from "@/lib/data";
import {
  AppButton,
  Field,
  Input,
  Modal,
  Notification,
  Select,
} from "@/components/ui";

type BaseUserRow = (typeof initialUsers)[number];

type UserRow = BaseUserRow & {
  username?: string;
  password?: string;
};

const defaultForm = {
  name: "",
  username: "",
  password: "",
  role: "Student",
  status: "Active",
  maxTime: "60 min",
};

const PAGE_SIZE = 50;

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>(initialUsers as UserRow[]);
  const [selectedUserId, setSelectedUserId] = useState<number>(
    initialUsers[0]?.id ?? 0
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [currentPage, setCurrentPage] = useState(1);

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importFileName, setImportFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? users[0],
    [selectedUserId, users]
  );

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  }, [users, currentPage]);

  const closeAddModal = () => {
    setModalOpen(false);
    setForm(defaultForm);
  };

  const closeImportModal = () => {
    setImportModalOpen(false);
    setImportFile(null);
    setImportFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addUser = () => {
    if (!form.name.trim()) {
      setNotice("Please enter the user's name before saving.");
      return;
    }

    if (!form.username.trim()) {
      setNotice("Please enter a username.");
      return;
    }

    if (!form.password.trim()) {
      setNotice("Please enter a password.");
      return;
    }

    const usernameExists = users.some(
      (user) => (user.username ?? "").toLowerCase() === form.username.trim().toLowerCase()
    );

    if (usernameExists) {
      setNotice("That username already exists.");
      return;
    }

    const nextId = Math.max(...users.map((user) => user.id), 0) + 1;

    const newUser: UserRow = {
      id: nextId,
      name: form.name.trim(),
      username: form.username.trim(),
      password: form.password.trim(),
      role: form.role,
      status: form.status,
      maxTime: form.role === "Admin" ? "Unlimited" : form.maxTime,
    };

    setUsers((current) => [newUser, ...current]);
    setSelectedUserId(nextId);
    setForm(defaultForm);
    setModalOpen(false);
    setCurrentPage(1);
    setNotice(`${newUser.name} was added successfully.`);
  };

  const handleImportFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    setImportFile(file);
    setImportFileName(file?.name ?? "");
  };

  const importStudentsFromFile = async () => {
    if (!importFile) {
      setNotice("Please choose a CSV file before importing.");
      return;
    }

    const isCsv =
      importFile.type === "text/csv" ||
      importFile.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      setNotice("Please upload a CSV file exported from Excel.");
      return;
    }

    const text = await importFile.text();
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length <= 1) {
      setNotice("The selected file does not contain enough data.");
      return;
    }

    const header = lines[0].split(",").map((item) => item.trim().toLowerCase());
    const rows = lines.slice(1);

    const nameIndex = header.indexOf("name");
    const usernameIndex = header.indexOf("username");
    const passwordIndex = header.indexOf("password");
    const roleIndex = header.indexOf("role");
    const statusIndex = header.indexOf("status");
    const maxTimeIndex = header.indexOf("maxtime");

    if (nameIndex === -1 || usernameIndex === -1 || passwordIndex === -1) {
      setNotice("CSV must contain name, username, and password columns.");
      return;
    }

    let nextId = Math.max(...users.map((user) => user.id), 0) + 1;
    const existingUsernames = new Set(
      users.map((user) => (user.username ?? "").toLowerCase()).filter(Boolean)
    );

    const importedUsers: UserRow[] = [];

    for (const row of rows) {
      const parts = row.split(",").map((part) => part.trim());

      const name = parts[nameIndex] ?? "";
      const username = parts[usernameIndex] ?? "";
      const password = parts[passwordIndex] ?? "";
      const role = (parts[roleIndex] as UserRow["role"]) || "Student";
      const status = (parts[statusIndex] as UserRow["status"]) || "Active";
      const maxTime =
        role === "Admin"
          ? "Unlimited"
          : parts[maxTimeIndex] || "60 min";

      if (!name || !username || !password) continue;
      if (existingUsernames.has(username.toLowerCase())) continue;

      existingUsernames.add(username.toLowerCase());

      importedUsers.push({
        id: nextId++,
        name,
        username,
        password,
        role,
        status,
        maxTime,
      });
    }

    if (!importedUsers.length) {
      setNotice("No valid account records were imported.");
      return;
    }

    setUsers((current) => [...importedUsers, ...current]);
    setSelectedUserId(importedUsers[0]?.id ?? selectedUserId);
    setCurrentPage(1);
    closeImportModal();
    setNotice(`${importedUsers.length} account(s) imported successfully.`);
  };

  const toggleStatus = () => {
    if (!selectedUser) return;

    const nextStatus = selectedUser.status === "Active" ? "Inactive" : "Active";

    setUsers((current) =>
      current.map((user) =>
        user.id === selectedUser.id ? { ...user, status: nextStatus } : user
      )
    );

    setNotice(`${selectedUser.name} is now ${nextStatus.toLowerCase()}.`);
  };

  const resetPassword = () => {
    if (!selectedUser) return;
    setNotice(`Password reset link prepared for ${selectedUser.name}.`);
  };

  const extendTime = () => {
    if (!selectedUser) return;

    const nextTime =
      selectedUser.role === "Admin"
        ? "Unlimited"
        : selectedUser.maxTime === "45 min"
        ? "60 min"
        : selectedUser.maxTime === "60 min"
        ? "90 min"
        : "120 min";

    setUsers((current) =>
      current.map((user) =>
        user.id === selectedUser.id ? { ...user, maxTime: nextTime } : user
      )
    );

    setNotice(`${selectedUser.name}'s max time was updated to ${nextTime}.`);
  };

  return (
    <div>
      <Topbar
        title="Users Management"
        subtitle="Manage admin and student accounts, time limits, account status, and imported registrations."
      />

      {notice ? (
        <Notification message={notice} onClose={() => setNotice("")} />
      ) : null}

      <SectionCard
        title="Registered Students"
        action="Add User"
        onAction={() => setModalOpen(true)}
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <AppButton onClick={() => setModalOpen(true)}>Add User</AppButton>
          <AppButton variant="ghost" onClick={() => setImportModalOpen(true)}>
            Import Accounts
          </AppButton>
        </div>

        <DataTable
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "username", label: "Username" },
            { key: "role", label: "Role" },
            {
              key: "status",
              label: "Status",
              render: (value) => <StatusBadge value={String(value)} />,
            },
            { key: "maxTime", label: "Max Time" },
          ]}
          data={paginatedUsers}
        />

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {users.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
            {Math.min(currentPage * PAGE_SIZE, users.length)} of {users.length} students
          </p>

          <div className="flex gap-2">
            <AppButton
              variant="ghost"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </AppButton>
            <AppButton
              variant="ghost"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </AppButton>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800">Selected account</p>
            <p className="mt-1 text-sm text-slate-500">
              Choose an account for quick admin actions.
            </p>
          </div>
          <Select
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(Number(event.target.value))}
            className="w-full lg:max-w-xs"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} · {user.role}
              </option>
            ))}
          </Select>
        </div>
      </SectionCard>

      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "Activate / Deactivate Accounts",
            description: selectedUser
              ? `Current status: ${selectedUser.status}`
              : "Select a user first.",
            button: selectedUser?.status === "Active" ? "Deactivate" : "Activate",
            action: toggleStatus,
          },
          {
            title: "Reset Student Password",
            description: selectedUser
              ? `Prepare a reset action for ${selectedUser.name}.`
              : "Select a user first.",
            button: "Reset Password",
            action: resetPassword,
          },
          {
            title: "Edit Time Limit Per Student",
            description: selectedUser
              ? `Current max time: ${selectedUser.maxTime}`
              : "Select a user first.",
            button: "Update Time Limit",
            action: extendTime,
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-[24px] border border-white/70 bg-white p-6 shadow-soft"
          >
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{item.description}</p>
            <AppButton className="mt-5 w-full" onClick={item.action}>
              {item.button}
            </AppButton>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeAddModal}
        title="Add user"
        description="Create a new admin or student account directly from the dashboard."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name">
            <Input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Enter full name"
            />
          </Field>

          <Field label="Username">
            <Input
              value={form.username}
              onChange={(event) =>
                setForm((current) => ({ ...current, username: event.target.value }))
              }
              placeholder="Enter username"
            />
          </Field>

          <Field label="Password">
            <Input
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Enter password"
            />
          </Field>

          <Field label="Role">
            <Select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({ ...current, role: event.target.value }))
              }
            >
              <option>Student</option>
              <option>Admin</option>
            </Select>
          </Field>

          <Field label="Status">
            <Select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value,
                }))
              }
            >
              <option>Active</option>
              <option>Inactive</option>
            </Select>
          </Field>

          <Field label="Maximum Time">
            <Select
              value={form.maxTime}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  maxTime: event.target.value,
                }))
              }
              disabled={form.role === "Admin"}
            >
              <option>45 min</option>
              <option>60 min</option>
              <option>90 min</option>
              <option>120 min</option>
            </Select>
          </Field>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <AppButton variant="ghost" onClick={closeAddModal}>
            Cancel
          </AppButton>
          <AppButton onClick={addUser}>Save User</AppButton>
        </div>
      </Modal>

      <Modal
        open={importModalOpen}
        onClose={closeImportModal}
        title="Import Accounts"
        description="Upload a CSV file exported from Excel with student usernames and passwords."
      >
        <div className="space-y-4">
          <Field label="Upload CSV File">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImportFileChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
            />
          </Field>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Required CSV columns:</p>
            <p className="mt-2 font-mono text-xs text-slate-700">
              name,username,password,role,status,maxTime
            </p>
            <p className="mt-3 font-medium text-slate-800">Example:</p>
            <p className="mt-2 font-mono text-xs text-slate-700">
              Juan Dela Cruz,juan2026,juan123,Student,Active,60 min
            </p>
            <p className="mt-1 font-mono text-xs text-slate-700">
              Maria Santos,maria2026,maria123,Student,Active,90 min
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            {importFileName ? (
              <span>
                Selected file: <strong>{importFileName}</strong>
              </span>
            ) : (
              <span>No file selected yet.</span>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <AppButton variant="ghost" onClick={closeImportModal}>
            Cancel
          </AppButton>
          <AppButton onClick={importStudentsFromFile}>
            Import Accounts
          </AppButton>
        </div>
      </Modal>
    </div>
  );
}