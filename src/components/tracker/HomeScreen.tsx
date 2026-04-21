import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CompletedSessionSummary } from "@/lib/tracker-db";

import { SectionHeader } from "./SectionHeader";
import { SessionsSidebar } from "./SessionsSidebar";
import { SessionsTable } from "./SessionsTable";

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
        className="tracker-action-primary h-14 w-full gap-2.5 text-base sm:text-lg"
        onClick={onCreateSession}
      >
        <Play className="size-4" />
        Start New Session
      </Button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_272px]">
        <SessionsTable sessions={sessions} />
        <SessionsSidebar sessions={sessions} />
      </div>
    </div>
  );
}
