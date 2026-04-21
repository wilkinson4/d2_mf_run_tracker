export function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="tracker-summary-metric">
      <p className="tracker-copy-muted text-[0.55rem] uppercase tracking-[0.24em]">
        {label}
      </p>
      <p className="tracker-display text-sm text-primary sm:text-base">
        {value}
      </p>
    </div>
  );
}
