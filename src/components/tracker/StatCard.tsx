export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="tracker-stat-card">
      <p className="tracker-copy-muted text-sm uppercase tracking-[0.28em]">
        {label}
      </p>
      <p className="tracker-display text-3xl text-primary sm:text-5xl">
        {value}
      </p>
    </div>
  );
}
