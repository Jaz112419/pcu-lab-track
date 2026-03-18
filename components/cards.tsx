import clsx from "clsx";
import { AppButton } from "@/components/ui";

export function SummaryCard({ title, value, helper, highlighted = false }: { title: string; value: string; helper: string; highlighted?: boolean }) {
  return (
    <div
      className={clsx(
        "rounded-[24px] border p-5 shadow-soft",
        highlighted ? "border-brand-500 bg-gradient-to-br from-brand-600 to-brand-800 text-white" : "border-white/60 bg-white"
      )}
    >
      <p className={clsx("text-sm", highlighted ? "text-white/75" : "text-slate-500")}>{title}</p>
      <h3 className="mt-3 text-2xl font-bold sm:text-3xl">{value}</h3>
      <p className={clsx("mt-2 text-sm", highlighted ? "text-white/75" : "text-slate-500")}>{helper}</p>
    </div>
  );
}

export function SectionCard({
  title,
  action,
  onAction,
  children,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white p-4 shadow-soft sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        {action ? (
          <AppButton className="w-full sm:w-auto" onClick={onAction}>
            {action}
          </AppButton>
        ) : null}
      </div>
      {children}
    </section>
  );
}
