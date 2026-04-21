import { Button } from "@/components/ui/button";
import type { CompletedSessionSummary } from "@/lib/tracker-db";

import { SectionHeader } from "./SectionHeader";
import { SectionLabel } from "./SectionLabel";
import { SessionHistoryCard } from "./SessionHistoryCard";

export function HomeScreen({
  sessions,
  onCreateSession,
}: {
  sessions: CompletedSessionSummary[];
  onCreateSession: () => void;
}) {
  return (
    <div className="tracker-screen">
      <SectionHeader title="Magic Finding Sessions" />

      <Button
        className="tracker-action-primary h-14 w-full text-base sm:text-lg"
        onClick={onCreateSession}
      >
        + Start New Session
      </Button>

      <section className="tracker-section-panel">
        <div className="space-y-3">
          <SectionLabel>&mdash; Session History &mdash;</SectionLabel>

          {sessions.length === 0 ? (
            <div className="tracker-copy-muted tracker-history-empty">
              No sessions recorded yet
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <SessionHistoryCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
