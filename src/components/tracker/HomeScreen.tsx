import { Button } from "@/components/ui/button";
import { type CompletedSessionSummary } from "@/lib/tracker-db";

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
    <div className="space-y-10">
      <SectionHeader title="Magic Finding Sessions" />

      <Button className="tracker-action-primary w-full py-10 text-2xl" onClick={onCreateSession}>
        + Start New Session
      </Button>

      <section className="tracker-panel px-6 py-6 sm:px-8 sm:py-8">
        <div className="space-y-8">
          <SectionLabel>&mdash; Session History &mdash;</SectionLabel>

          {sessions.length === 0 ? (
            <div className="tracker-copy-muted flex min-h-72 items-center justify-center text-center text-xl">
              No sessions recorded yet
            </div>
          ) : (
            <div className="space-y-5">
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
