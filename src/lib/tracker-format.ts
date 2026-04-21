export function parseSqliteDate(value: string) {
  if (value.includes("T")) {
    return new Date(value);
  }

  return new Date(`${value.replace(" ", "T")}Z`);
}

export function getDurationMs(startedAt: string, endedAt: string) {
  return (
    parseSqliteDate(endedAt).getTime() - parseSqliteDate(startedAt).getTime()
  );
}

export function formatDuration(
  durationMs: number | null,
  options?: {
    includeHundredths?: boolean;
  },
) {
  if (durationMs === null || Number.isNaN(durationMs)) {
    return "--";
  }

  const clampedMs = Math.max(durationMs, 0);
  const totalSeconds = Math.floor(clampedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((clampedMs % 1000) / 10);

  const base =
    hours > 0
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      : `${minutes}:${seconds.toString().padStart(2, "0")}`;

  if (!options?.includeHundredths) {
    return base;
  }

  return `${base}.${hundredths.toString().padStart(2, "0")}`;
}

export function formatSessionDateShort(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parseSqliteDate(value));
}

export function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parseSqliteDate(value));
}
