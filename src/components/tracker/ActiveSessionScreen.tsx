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
    <div className="space-y-10">
      <SectionHeader title={locationName.toUpperCase()} />

      {activeSession?.activeRun ? (
        <section className="tracker-current-run-panel flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-8">
          <SectionLabel>&mdash; Current Run &mdash;</SectionLabel>
          <p className="tracker-display text-5xl text-[var(--tracker-current-run-accent)] sm:text-7xl">
            {formatDuration(currentRunElapsedMs, { includeHundredths: true })}
          </p>
          <Button
            className="tracker-action-primary min-w-72 px-14 py-8 text-3xl"
            disabled={busyAction !== null}
            onClick={onToggleRun}
          >
            End Run
          </Button>
        </section>
      ) : (
        <section className="flex flex-col items-center gap-6 py-2 text-center">
          <Button
            className="tracker-action-primary min-w-72 px-14 py-8 text-3xl"
            disabled={busyAction !== null}
            onClick={onToggleRun}
          >
            Start Run
          </Button>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
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

      <section className="tracker-panel px-6 py-6 sm:px-8 sm:py-8">
        <div className="space-y-6">
          <SectionLabel>&mdash; Run History &mdash;</SectionLabel>

          {completedRuns.length > 0 ? (
            <div className="space-y-3">
              {completedRuns.map((run, index) => (
                <div
                  key={run.id}
                  className="tracker-copy-muted flex items-center justify-between border-t border-border/40 pt-4 first:border-t-0 first:pt-0"
                >
                  <span className="text-lg sm:text-2xl">Run #{index + 1}</span>
                  <span className="tracker-display text-2xl text-primary sm:text-4xl">
                    {formatDuration(run.durationMs, {
                      includeHundredths: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="tracker-copy-muted text-lg">
              {isDraft
                ? "This session has not started yet. Start your first run to begin tracking."
                : "No completed runs yet. Start your first run to begin tracking."}
            </div>
          )}

          {activeSession?.activeRun ? (
            <div className="tracker-copy-muted border-t border-border/40 pt-4 text-base sm:text-lg">
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
            className="tracker-action-secondary w-full py-8 text-3xl"
            disabled={busyAction !== null}
            onClick={onDiscardDraft}
          >
            Cancel
          </Button>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          <Button
            className="tracker-action-primary py-8 text-3xl"
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
            className="tracker-action-secondary py-8 text-3xl"
            disabled={busyAction !== null || !activeSession?.activeRun}
            onClick={onCancelRun}
          >
            Cancel
          </Button>
        </section>
      )}
    </div>
  );
}
