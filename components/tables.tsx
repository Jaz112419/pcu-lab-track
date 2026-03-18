import clsx from "clsx";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, unknown>>({ columns, data }: { columns: Column<T>[]; data: T[] }) {
  return (
    <div className="rounded-2xl border border-slate-100">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-slate-100 bg-white">
                {columns.map((column) => {
                  const value = row[column.key];
                  return (
                    <td key={String(column.key)} className="px-4 py-3 text-slate-700">
                      {column.render ? column.render(value, row) : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="space-y-3">
              {columns.map((column) => {
                const value = row[column.key];
                return (
                  <div key={String(column.key)} className="flex items-start justify-between gap-4">
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{column.label}</span>
                    <div className="max-w-[65%] text-right text-sm text-slate-700">
                      {column.render ? column.render(value, row) : String(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
        value.toLowerCase().includes("maintenance") && "bg-amber-100 text-amber-700",
        value.toLowerCase().includes("inactive") && "bg-rose-100 text-rose-700",
        value.toLowerCase().includes("idle") && "bg-orange-100 text-orange-700",
        (value.toLowerCase().includes("active") || value.toLowerCase().includes("available") || value.toLowerCase().includes("high usage") || value.toLowerCase().includes("in use")) &&
          "bg-emerald-100 text-emerald-700"
      )}
    >
      {value}
    </span>
  );
}
