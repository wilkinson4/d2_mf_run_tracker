import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SectionHeader } from "./SectionHeader";
import { SectionLabel } from "./SectionLabel";

export function NewSessionScreen({
  areaName,
  error,
  popularAreas,
  onAreaNameChange,
  onCancel,
  onSelectArea,
  onStart,
}: {
  areaName: string;
  error: string | null;
  popularAreas: string[];
  onAreaNameChange: (value: string) => void;
  onCancel: () => void;
  onSelectArea: (value: string) => void;
  onStart: () => void;
}) {
  return (
    <div className="tracker-screen">
      <SectionHeader title="New MF Session" />

      <section className="space-y-4">
        <div className="space-y-2">
          <SectionLabel>Area Name</SectionLabel>
          <Input
            value={areaName}
            onChange={(event) => onAreaNameChange(event.currentTarget.value)}
            placeholder="Enter farming area..."
            className="tracker-input"
          />
          {error ? (
            <p className="text-xs text-destructive sm:text-sm">{error}</p>
          ) : null}
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <Button
            className="tracker-action-primary h-12 text-base"
            onClick={onStart}
          >
            Start Session
          </Button>
          <Button
            variant="outline"
            className="tracker-action-secondary h-12 text-base"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>

        <div className="border-t border-border/60 pt-3">
          <div className="space-y-3">
            <SectionLabel>&mdash; Popular Areas &mdash;</SectionLabel>
            <div className="grid gap-1.5 md:grid-cols-2">
              {popularAreas.map((area) => (
                <button
                  type="button"
                  key={area}
                  className="tracker-popular-area"
                  onClick={() => onSelectArea(area)}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
