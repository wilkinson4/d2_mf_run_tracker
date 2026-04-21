import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <div className="tracker-stat-card">
      {icon && <span className="text-muted-foreground/70">{icon}</span>}
      <p className="tracker-copy-muted text-[0.55rem] uppercase tracking-[0.24em]">
        {label}
      </p>
      <p className="tracker-display text-lg text-primary sm:text-xl">{value}</p>
    </div>
  );
}
