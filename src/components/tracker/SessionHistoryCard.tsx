import { useState } from "react";

import { type CompletedSessionSummary } from "@/lib/tracker-db";
import { formatDuration, formatSessionDate } from "@/lib/tracker-format";

import { SummaryMetric } from "./SummaryMetric";

export function SessionHistoryCard({
  session,
}: {
  session: CompletedSessionSummary;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="tracker-panel px-6 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h3 className="tracker-display text-3xl text-primary">{session.locationName}</h3>
            <p className="tracker-copy-muted text-base">{formatSessionDate(session.startedAt)}</p>
          </div>
          <div className="tracker-panel tracker-copy-muted inline-flex min-w-16 items-center justify-center px-4 py-3">
            #{session.id}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryMetric label="Duration" value={formatDuration(session.durationMs)} />
          <SummaryMetric label="Runs" value={String(session.totalRuns)} />
          <SummaryMetric label="Avg" value={formatDuration(session.averageRunMs)} />
          <SummaryMetric label="Fastest" value={formatDuration(session.fastestRunMs)} />
          <SummaryMetric label="Slowest" value={formatDuration(session.slowestRunMs)} />
        </div>

        <div className="border-t border-border/60 pt-5">
          <button
            type="button"
            className="tracker-copy-muted inline-flex items-center gap-3 text-left text-lg uppercase tracking-[0.12em] transition-colors hover:text-primary"
            onClick={() => setIsExpanded((current) => !current)}
          >
            <span className="text-sm">{isExpanded ? "▼" : "▶"}</span>
            View All Runs ({session.totalRuns})
          </button>

          {isExpanded ? (
            session.runs.length > 0 ? (
              <div className="mt-5 space-y-3">
                {session.runs.map((run, index) => (
                  <div
                    key={run.id}
                    className="tracker-copy-muted flex items-center justify-between border-t border-border/30 pt-3"
                  >
                    <span className="text-base sm:text-lg">Run #{index + 1}</span>
                    <span className="tracker-display text-xl text-primary sm:text-2xl">
                      {formatDuration(run.durationMs)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 tracker-copy-muted">No runs were recorded in this session.</p>
            )
          ) : null}
        </div>
      </div>
    </article>
  );
}
