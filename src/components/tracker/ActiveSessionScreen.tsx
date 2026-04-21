import { Button } from "@/components/ui/button";
import type { ActiveSession } from "@/lib/tracker-db";
import { formatDuration, parseSqliteDate } from "@/lib/tracker-format";

import { SectionHeader } from "./SectionHeader";
import { SectionLabel } from "./SectionLabel";
import { StatCard } from "./StatCard";

type ActiveSessionScreenProps = {
  activeSession: ActiveSession | null;
  busyAction: string | null;
  draftAreaName?: string;
  now: number;
  onCancelRun: () => void;
  onDiscardDraft: () => void;
  onEndSession: () => void;
  onToggleRun: () => void;
};

export function ActiveSessionScreen({
  activeSession,
  busyAction,
  draftAreaName,
  now,
  onCancelRun,
  onDiscardDraft,
  onEndSession,
  onToggleRun,
}: ActiveSessionScreenProps) {
  const isDraft = !activeSession && !!draftAreaName;
  const locationName = activeSession?.locationName ?? draftAreaName ?? "";
  const completedRuns = activeSession?.completedRuns ?? [];
  const currentRunElapsedMs = activeSession?.activeRun
    ? now - parseSqliteDate(activeSession.activeRun.startedAt).getTime()
    : null;
  const sessionElapsedMs = activeSession
    ? now - parseSqliteDate(activeSession.startedAt).getTime()
    : null;
  const averageRunMs =
    completedRuns.length > 0
      ? completedRuns.reduce((total, run) => total + (run.durationMs ?? 0), 0) /
        completedRuns.length
      : null;

  return (
    <div className="tracker-screen">
      <SectionHeader title={locationName.toUpperCase()} />

      {activeSession?.activeRun ? (
        <section className="tracker-current-run-panel flex flex-col items-center gap-3 px-4 py-4 text-center sm:px-5">
          <SectionLabel>&mdash; Current Run &mdash;</SectionLabel>
          <p className="tracker-display text-5xl text-[var(--tracker-current-run-accent)] sm:text-[3.25rem]">
            {formatDuration(currentRunElapsedMs, { includeHundredths: true })}
          </p>
          <Button
            className="tracker-action-primary h-11 min-w-[200px] px-8 text-base sm:text-lg"
            disabled={busyAction !== null}
            onClick={onToggleRun}
          >
            End Run
          </Button>
        </section>
      ) : (
        <section className="flex flex-col items-center gap-3 py-1 text-center">
          <Button
            className="tracker-action-primary h-11 min-w-[200px] px-8 text-base sm:text-lg"
            disabled={busyAction !== null}
            onClick={onToggleRun}
          >
            Start Run
          </Button>
        </section>
      )}

      <section className="tracker-stat-grid">
        <StatCard
          label="Session Time"
          value={
            sessionElapsedMs === null
              ? "--"
              : formatDuration(sessionElapsedMs, { includeHundredths: true })
          }
        />
        <StatCard label="Runs" value={completedRuns.length} />
        <StatCard
          label="Avg Run Time"
          value={formatDuration(averageRunMs, { includeHundredths: true })}
        />
      </section>

      <section className="tracker-section-panel">
        <div className="space-y-4">
          <SectionLabel>&mdash; Run History &mdash;</SectionLabel>

          {completedRuns.length > 0 ? (
            <div>
              {completedRuns.map((run, index) => (
                <div key={run.id} className="tracker-run-history-row">
                  <span className="text-sm sm:text-base">Run #{index + 1}</span>
                  <span className="tracker-display text-base text-primary sm:text-lg">
                    {formatDuration(run.durationMs, {
                      includeHundredths: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="tracker-copy-muted text-sm sm:text-base">
              {isDraft
                ? "This session has not started yet. Start your first run to begin tracking."
                : "No completed runs yet. Start your first run to begin tracking."}
            </div>
          )}

          {activeSession?.activeRun ? (
            <div className="tracker-inline-note">
              A run is currently in progress. Use{" "}
              <span className="text-primary">End Run</span> to save it or{" "}
              <span className="text-primary">Cancel</span> to discard it.
            </div>
          ) : null}
        </div>
      </section>

      {isDraft ? (
        <section>
          <Button
            variant="outline"
            className="tracker-action-secondary h-12 w-full text-base"
            disabled={busyAction !== null}
            onClick={onDiscardDraft}
          >
            Cancel
          </Button>
        </section>
      ) : (
        <section className="grid gap-2 md:grid-cols-2">
          <Button
            className="tracker-action-primary h-12 text-base"
            disabled={
              busyAction !== null ||
              activeSession?.activeRun !== null ||
              completedRuns.length === 0
            }
            onClick={onEndSession}
          >
            End Session
          </Button>
          <Button
            variant="outline"
            className="tracker-action-secondary h-12 text-base"
            disabled={busyAction !== null || !activeSession?.activeRun}
            onClick={onCancelRun}
          >
            Cancel Run
          </Button>
        </section>
      )}
    </div>
  );
}
