import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type FarmLocation = {
  value: string;
  label: string;
};

export const Route = createFileRoute("/")({
  component: Index,
});

async function getFarmLocations(
  setFarmLocations: React.Dispatch<React.SetStateAction<FarmLocation[]>>,
) {
  const db = await Database.load("sqlite:run_tracker.db");
  const locations: Array<FarmLocation> = await db.select(
    "select id as value, location_name as label from farm_locations;",
  );
  setFarmLocations(locations);
}

function Index() {
  const [selectedLocationId, setSelectedLocationId] = useState<
    undefined | string
  >();
  const [farmLocations, setFarmLocations] = useState<Array<FarmLocation>>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    getFarmLocations(setFarmLocations);
  }, []);

  const handleStartSession = () => {
    if (!selectedLocationId) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div className="p-10">
      {farmLocations.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          <Field data-invalid={error} className="w-full max-w-48">
            <Select
              value={selectedLocationId}
              onValueChange={setSelectedLocationId}
            >
              <SelectTrigger className="w-full max-w-48" aria-invalid={error}>
                <SelectValue placeholder="Select a location..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a location...</SelectLabel>
                  {farmLocations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {error && <FieldError>Please select a location.</FieldError>}
          </Field>
          <Button onClick={handleStartSession}>Start Session</Button>
        </>
      )}
    </div>
  );
}
