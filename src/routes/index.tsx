import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { HomeScreen } from "@/components/tracker/HomeScreen";
import { TrackerShell } from "@/components/tracker/TrackerShell";
import { useTrackerData } from "@/hooks/useTrackerData";
import { deleteCompletedSession } from "@/lib/tracker-db";
import { getTrackerErrorMessage } from "@/lib/tracker-error";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

function IndexRoute() {
  const navigate = useNavigate();
  const {
    activeSession,
    completedSessions,
    isLoading,
    loadError,
    refreshTracker,
  } = useTrackerData();
  const [screenError, setScreenError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && activeSession) {
      void navigate({ to: "/session", replace: true });
    }
  }, [activeSession, isLoading, navigate]);

  const handleDeleteSession = async (sessionId: number) => {
    setScreenError(null);

    try {
      await deleteCompletedSession(sessionId);
      await refreshTracker();
    } catch (error) {
      const message = getTrackerErrorMessage(error);
      setScreenError(message);

      throw error instanceof Error ? error : new Error(message);
    }
  };

  return (
    <TrackerShell error={screenError ?? loadError}>
      <HomeScreen
        onDeleteSession={handleDeleteSession}
        sessions={completedSessions}
        onCreateSession={() => {
          setScreenError(null);
          void navigate({ to: "/new-session" });
        }}
      />
    </TrackerShell>
  );
}
