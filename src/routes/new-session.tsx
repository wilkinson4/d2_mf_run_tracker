import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { NewSessionScreen } from "@/components/tracker/NewSessionScreen";
import { TrackerShell } from "@/components/tracker/TrackerShell";
import { useTrackerData } from "@/hooks/useTrackerData";

export const Route = createFileRoute("/new-session")({
  component: NewSessionRoute,
});

const POPULAR_AREA_NAMES = [
  "Mephisto",
  "Andariel",
  "Baal",
  "Diablo",
  "Pindleskin",
  "Ancient Tunnels",
  "Chaos Sanctuary",
  "Travincal",
  "Secret Cow Level",
  "The Pit",
  "Arcane Sanctuary",
  "Lower Kurast",
] as const;

function NewSessionRoute() {
  const navigate = useNavigate();
  const { activeSession, farmLocations, isLoading, loadError } = useTrackerData();
  const [areaName, setAreaName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && activeSession) {
      void navigate({ to: "/session", replace: true });
    }
  }, [activeSession, isLoading, navigate]);

  const popularAreas = useMemo(
    () =>
      POPULAR_AREA_NAMES.map(
        (name) => farmLocations.find((location) => location.name === name)?.name ?? name,
      ),
    [farmLocations],
  );

  const navigateToDraftSession = (nextAreaName: string) => {
    const trimmedAreaName = nextAreaName.trim();

    if (!trimmedAreaName) {
      setFormError("Please enter a farming area before starting the session.");
      return;
    }

    setFormError(null);
    setAreaName("");
    void navigate({ to: "/session", search: { area: trimmedAreaName } });
  };

  return (
    <TrackerShell error={loadError} isLoading={isLoading}>
      <NewSessionScreen
        areaName={areaName}
        error={formError}
        popularAreas={popularAreas}
        onAreaNameChange={(value) => {
          setAreaName(value);
          if (formError) {
            setFormError(null);
          }
        }}
        onCancel={() => {
          void navigate({ to: "/" });
        }}
        onSelectArea={navigateToDraftSession}
        onStart={() => {
          navigateToDraftSession(areaName);
        }}
      />
    </TrackerShell>
  );
}
