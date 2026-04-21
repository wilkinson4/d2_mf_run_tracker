export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="tracker-stat-card">
      <p className="tracker-copy-muted text-[0.55rem] uppercase tracking-[0.24em]">
        {label}
      </p>
      <p className="tracker-display text-lg text-primary sm:text-xl">{value}</p>
    </div>
  );
}
