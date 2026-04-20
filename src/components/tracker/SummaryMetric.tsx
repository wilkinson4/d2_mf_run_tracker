export function SummaryMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="tracker-panel flex min-h-28 flex-col items-center justify-center gap-3 px-5 py-4 text-center">
      <p className="tracker-copy-muted text-xs uppercase tracking-[0.28em] sm:text-sm">
        {label}
      </p>
      <p className="tracker-display text-2xl text-primary sm:text-4xl">
        {value}
      </p>
    </div>
  );
}
