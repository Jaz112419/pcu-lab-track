export const summaryCards = [
  { title: "Total Laboratories", value: "3", helper: "2 active, 1 under maintenance" },
  { title: "Computers", value: "90", helper: "74 available right now" },
  { title: "Active Sessions", value: "24", helper: "+6 since 8:00 AM" },
  { title: "Registered Students", value: "267", helper: "12 new this month" },
];

export const labs = [
  { id: "LAB-A", name: "Lab A", location: "Building 1", capacity: 30, inUse: 28, status: "High usage" },
  { id: "LAB-B", name: "Lab B", location: "Building 2", capacity: 25, inUse: 10, status: "Available" },
  { id: "LAB-C", name: "Lab C", location: "IT Annex", capacity: 35, inUse: 0, status: "Maintenance" },
];

export const activeSessions = [
  {
    student: "Allyssa Mae De Leon",
    studentId: "2026-0012",
    building: "Building 1",
    laboratoryNumber: "LAB-A",
    section: "BSIT-1A",
    computer: "PC-02",
    lab: "Lab A",
    loginTime: "9:05 AM",
    usage: "52 min",
    remaining: "8 min",
    status: "Active",
  },
  {
    student: "Jazmin Dela Fuente",
    studentId: "2026-0048",
    building: "Building 1",
    laboratoryNumber: "LAB-A",
    section: "BSIT-1B",
    computer: "PC-11",
    lab: "Lab A",
    loginTime: "9:20 AM",
    usage: "36 min",
    remaining: "24 min",
    status: "Active",
  },
  {
    student: "Caila Torres",
    studentId: "2026-0104",
    building: "Building 2",
    laboratoryNumber: "LAB-B",
    section: "BSCS-2A",
    computer: "PC-03",
    lab: "Lab B",
    loginTime: "8:58 AM",
    usage: "44 min",
    remaining: "16 min",
    status: "Idle warning",
  },
  {
    student: "Nomer Ropero",
    studentId: "2026-0089",
    building: "Building 2",
    laboratoryNumber: "LAB-B",
    section: "BSIT-2B",
    computer: "PC-07",
    lab: "Lab B",
    loginTime: "9:12 AM",
    usage: "31 min",
    remaining: "29 min",
    status: "Active",
  },
];

export const users = [
  { id: 1, name: "Hadassa", role: "Admin", status: "Active", maxTime: "Unlimited" },
  { id: 25, name: "Allyssa Mae De Leon", role: "Student", status: "Active", maxTime: "60 min" },
  { id: 26, name: "Jazmin Dela Fuente", role: "Student", status: "Inactive", maxTime: "45 min" },
  { id: 27, name: "Caila Torres", role: "Student", status: "Active", maxTime: "90 min" },
];

export const auditLogs = [
  { user: "Nomer Ropero", action: "Login", entity: "Session", time: "09:05 AM" },
  { user: "Jazmin Dela Fuente", action: "Auto logout", entity: "Session", time: "10:05 AM" },
  { user: "Hadassa", action: "Force logout", entity: "Session", time: "11:10 AM" },
  { user: "System", action: "Computer boot", entity: "PC-07", time: "11:16 AM" },
];