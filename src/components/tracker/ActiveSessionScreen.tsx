import {
  register,
  type ShortcutEvent,
  unregister,
} from "@tauri-apps/plugin-global-shortcut";
import {
  CheckCircle,
  Clock,
  Hash,
  History,
  Timer,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import type { ActiveSession } from "@/lib/tracker-db";
import { formatDuration, parseSqliteDate } from "@/lib/tracker-format";

import { SectionHeader } from "./SectionHeader";
import { SectionLabel } from "./SectionLabel";
import { StatCard } from "./StatCard";

const SHORTCUTS = [
  "CommandOrControl+Shift+S",
  "CommandOrControl+Shift+C",
  "CommandOrControl+Shift+E",
] as const;

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
  const toggleRunRef = useRef(onToggleRun);
  const cancelRunRef = useRef(onCancelRun);
  const endSessionRef = useRef(onEndSession);
  const busyActionRef = useRef(busyAction);

  useEffect(() => {
    toggleRunRef.current = onToggleRun;
    cancelRunRef.current = onCancelRun;
    busyActionRef.current = busyAction;
    endSessionRef.current = onEndSession;
  }, [busyAction, onCancelRun, onToggleRun, onEndSession]);

  useEffect(() => {
    const registerShortcuts = async () => {
      await register(SHORTCUTS[0], (event: ShortcutEvent) => {
        if (event.state === "Pressed") {
          toggleRunRef.current();
        }
      });

      await register(SHORTCUTS[1], (event: ShortcutEvent) => {
        if (event.state === "Pressed") {
          cancelRunRef.current();
        }
      });
      await register(SHORTCUTS[2], (event: ShortcutEvent) => {
        if (event.state === "Pressed") {
          endSessionRef.current();
        }
      });
    };

    registerShortcuts();

    return () => {
      unregister([...SHORTCUTS]);
    };
  }, []);

  return (
    <div className="tracker-screen">
      <SectionHeader title={locationName.toUpperCase()} />

      {activeSession?.activeRun ? (
        <section className="tracker-current-run-panel flex flex-col items-center gap-3 px-4 py-4 text-center sm:px-5">
          <div className="flex items-center gap-1.5">
            <Zap className="size-3 animate-pulse text-(--tracker-current-run-accent)" />
            <SectionLabel>Active Run</SectionLabel>
          </div>
          <p className="tracker-display text-5xl text-[--tracker-current-run-accent] sm:text-[3.25rem]">
            {formatDuration(currentRunElapsedMs, { includeHundredths: true })}
          </p>
          <div className="flex w-full justify-center gap-2">
            <Button
              className="tracker-action-primary h-11 min-w-40 gap-2 px-6 text-base sm:text-lg"
              disabled={busyAction !== null}
              onClick={onToggleRun}
            >
              <CheckCircle className="size-4" />
              End Run
            </Button>
            <Button
              variant="outline"
              className="tracker-action-secondary h-11 gap-2 px-5 text-base"
              disabled={busyAction !== null}
              onClick={onCancelRun}
            >
              <XCircle className="size-4" />
              Cancel
            </Button>
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center gap-3 py-1 text-center">
          <Button
            className="tracker-action-primary h-11 min-w-50 gap-2 px-8 text-base sm:text-lg"
            disabled={busyAction !== null}
            onClick={onToggleRun}
          >
            <Zap className="size-4" />
            Start Run
          </Button>
        </section>
      )}

      <section className="tracker-stat-grid">
        <StatCard
          label="Session Time"
          icon={<Clock className="size-4" />}
          value={
            sessionElapsedMs === null
              ? "--"
              : formatDuration(sessionElapsedMs, { includeHundredths: true })
          }
        />
        <StatCard
          label="Runs"
          icon={<Hash className="size-4" />}
          value={completedRuns.length}
        />
        <StatCard
          label="Avg Run Time"
          icon={<Timer className="size-4" />}
          value={formatDuration(averageRunMs, { includeHundredths: true })}
        />
      </section>

      <section className="tracker-section-panel">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="size-3.5 text-muted-foreground/70" />
            <SectionLabel>&mdash; Run History &mdash;</SectionLabel>
          </div>

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
            className="tracker-action-secondary h-12 w-full gap-2 text-base"
            disabled={busyAction !== null}
            onClick={onDiscardDraft}
          >
            <XCircle className="size-4" />
            Cancel
          </Button>
        </section>
      ) : (
        <section>
          <Button
            className="tracker-action-primary h-12 w-full gap-2 text-base"
            disabled={
              busyAction !== null ||
              activeSession?.activeRun !== null ||
              completedRuns.length === 0
            }
            onClick={onEndSession}
          >
            <Trophy className="size-4" />
            End Session
          </Button>
        </section>
      )}
    </div>
  );
}
