import { useCallback, useEffect, useState } from "react";

import {
  type ActiveSession,
  type CompletedSessionSummary,
  type FarmLocation,
  getActiveSession,
  getCompletedSessionSummaries,
  getFarmLocations,
} from "@/lib/tracker-db";
import { getTrackerErrorMessage } from "@/lib/tracker-error";

type TrackerData = {
  farmLocations: FarmLocation[];
  completedSessions: CompletedSessionSummary[];
  activeSession: ActiveSession | null;
};

export function useTrackerData() {
  const [farmLocations, setFarmLocations] = useState<FarmLocation[]>([]);
  const [completedSessions, setCompletedSessions] = useState<
    CompletedSessionSummary[]
  >([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadTrackerData = useCallback(async (): Promise<TrackerData> => {
    const [locations, sessions, currentSession] = await Promise.all([
      getFarmLocations(),
      getCompletedSessionSummaries(),
      getActiveSession(),
    ]);

    return {
      activeSession: currentSession,
      completedSessions: sessions,
      farmLocations: locations,
    };
  }, []);

  const refreshTracker = useCallback(async () => {
    const nextData = await loadTrackerData();
    setFarmLocations(nextData.farmLocations);
    setCompletedSessions(nextData.completedSessions);
    setActiveSession(nextData.activeSession);
    setLoadError(null);
    return nextData;
  }, [loadTrackerData]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const nextData = await loadTrackerData();

        if (!isMounted) {
          return;
        }

        setFarmLocations(nextData.farmLocations);
        setCompletedSessions(nextData.completedSessions);
        setActiveSession(nextData.activeSession);
        setLoadError(null);
      } catch (error) {
        if (isMounted) {
          setLoadError(getTrackerErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [loadTrackerData]);

  return {
    activeSession,
    completedSessions,
    farmLocations,
    isLoading,
    loadError,
    refreshTracker,
  };
}
