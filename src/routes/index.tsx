import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { HomeScreen } from "@/components/tracker/HomeScreen";
import { TrackerShell } from "@/components/tracker/TrackerShell";
import { useTrackerData } from "@/hooks/useTrackerData";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

function IndexRoute() {
  const navigate = useNavigate();
  const { activeSession, completedSessions, isLoading, loadError } = useTrackerData();

  useEffect(() => {
    if (!isLoading && activeSession) {
      void navigate({ to: "/session", replace: true });
    }
  }, [activeSession, isLoading, navigate]);

  return (
    <TrackerShell error={loadError} isLoading={isLoading}>
      <HomeScreen
        sessions={completedSessions}
        onCreateSession={() => {
          void navigate({ to: "/new-session" });
        }}
      />
    </TrackerShell>
  );
}
