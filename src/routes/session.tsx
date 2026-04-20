import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ActiveSessionScreen } from "@/components/tracker/ActiveSessionScreen";
import { TrackerShell } from "@/components/tracker/TrackerShell";
import {
  cancelRun,
  completeRun,
  createSessionAndStartRun,
  discardSession,
  endSession,
  startRun,
  type ActiveSession,
} from "@/lib/tracker-db";
import { getTrackerErrorMessage } from "@/lib/tracker-error";
import { useTrackerData } from "@/hooks/useTrackerData";

type SessionSearch = {
  area?: string;
};

export const Route = createFileRoute("/session")({
  validateSearch: (search): SessionSearch => ({
    area: typeof search.area === "string" ? search.area : undefined,
  }),
  component: SessionRoute,
});

function SessionRoute() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { activeSession, isLoading, loadError, refreshTracker } = useTrackerData();
  const [transitionSession, setTransitionSession] = useState<ActiveSession | null>(null);
  const [screenError, setScreenError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const resolvedActiveSession = activeSession ?? transitionSession;

  useEffect(() => {
    if (activeSession) {
      setTransitionSession(null);
    }
  }, [activeSession]);

  useEffect(() => {
    if (!resolvedActiveSession) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [resolvedActiveSession]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (resolvedActiveSession && search.area) {
      void navigate({ to: "/session", search: {}, replace: true });
      return;
    }

    if (!resolvedActiveSession && !search.area && !busyAction) {
      void navigate({ to: "/", replace: true });
    }
  }, [busyAction, isLoading, navigate, resolvedActiveSession, search.area]);

  const runAction = async (busyKey: string, action: () => Promise<void>) => {
    setBusyAction(busyKey);
    setScreenError(null);

    try {
      await action();
    } catch (error) {
      setScreenError(getTrackerErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  };

  const handleToggleRun = () => {
    if (!resolvedActiveSession && !search.area) {
      return;
    }

    void runAction(resolvedActiveSession?.activeRun ? "finish-run" : "start-run", async () => {
      if (search.area && !resolvedActiveSession) {
        const createdSession = await createSessionAndStartRun(search.area);
        setTransitionSession(createdSession);
        void navigate({ to: "/session", search: {}, replace: true });
        await refreshTracker();
        return;
      }

      if (!resolvedActiveSession) {
        return;
      }

      if (resolvedActiveSession.activeRun) {
        await completeRun(resolvedActiveSession.activeRun.id, resolvedActiveSession.id);
      } else {
        await startRun(resolvedActiveSession.id);
      }

      await refreshTracker();
    });
  };

  const handleCancelRun = () => {
    const activeRun = resolvedActiveSession?.activeRun;

    if (!resolvedActiveSession || !activeRun) {
      return;
    }

    void runAction("cancel-run", async () => {
      await cancelRun(activeRun.id, resolvedActiveSession.id);
      await refreshTracker();

      if (resolvedActiveSession.completedRuns.length === 0) {
        void navigate({ to: "/", replace: true });
      }
    });
  };

  const handleEndSession = () => {
    if (!resolvedActiveSession) {
      return;
    }

    void runAction("end-session", async () => {
      if (resolvedActiveSession.completedRuns.length === 0) {
        await discardSession(resolvedActiveSession.id);
      } else {
        await endSession(resolvedActiveSession.id);
      }

      await refreshTracker();
      void navigate({ to: "/", replace: true });
    });
  };

  return (
    <TrackerShell error={screenError ?? loadError} isLoading={isLoading}>
      <ActiveSessionScreen
        activeSession={resolvedActiveSession}
        busyAction={busyAction}
        draftAreaName={search.area}
        now={now}
        onCancelRun={handleCancelRun}
        onDiscardDraft={() => {
          setScreenError(null);
          void navigate({ to: "/", replace: true });
        }}
        onEndSession={handleEndSession}
        onToggleRun={handleToggleRun}
      />
    </TrackerShell>
  );
}
