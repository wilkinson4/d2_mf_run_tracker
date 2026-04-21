import { useState } from "react";

import type { CompletedSessionSummary } from "@/lib/tracker-db";
import { formatDuration, formatSessionDate } from "@/lib/tracker-format";

import { SummaryMetric } from "./SummaryMetric";

export function SessionHistoryCard({
  session,
}: {
  session: CompletedSessionSummary;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="tracker-session-card">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h3 className="tracker-display text-xl text-primary sm:text-2xl">
              {session.locationName}
            </h3>
            <p className="tracker-copy-muted text-xs sm:text-sm">
              {formatSessionDate(session.startedAt)}
            </p>
          </div>
          <div className="tracker-session-badge">#{session.id}</div>
        </div>

        <div className="tracker-session-metrics">
          <SummaryMetric
            label="Duration"
            value={formatDuration(session.durationMs)}
          />
          <SummaryMetric label="Runs" value={String(session.totalRuns)} />
          <SummaryMetric
            label="Avg"
            value={formatDuration(session.averageRunMs)}
          />
          <SummaryMetric
            label="Fastest"
            value={formatDuration(session.fastestRunMs)}
          />
          <SummaryMetric
            label="Slowest"
            value={formatDuration(session.slowestRunMs)}
          />
        </div>

        <div className="border-t border-border/60 pt-3">
          <button
            type="button"
            className="tracker-copy-muted inline-flex items-center gap-2 text-left text-xs uppercase tracking-[0.18em] transition-colors hover:text-primary"
            onClick={() => setIsExpanded((current) => !current)}
          >
            <span className="text-[0.65rem]">{isExpanded ? "▼" : "▶"}</span>
            View All Runs ({session.totalRuns})
          </button>

          {isExpanded ? (
            session.runs.length > 0 ? (
              <div className="mt-3">
                {session.runs.map((run, index) => (
                  <div key={run.id} className="tracker-run-history-row">
                    <span className="text-sm sm:text-base">
                      Run #{index + 1}
                    </span>
                    <span className="tracker-display text-base text-primary sm:text-lg">
                      {formatDuration(run.durationMs)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm tracker-copy-muted">
                No runs were recorded in this session.
              </p>
            )
          ) : null}
        </div>
      </div>
    </article>
  );
}
