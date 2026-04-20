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
    <div className="space-y-10">
      <SectionHeader title="New MF Session" />

      <section className="space-y-10">
        <div className="space-y-4">
          <SectionLabel>Area Name</SectionLabel>
          <Input
            value={areaName}
            onChange={(event) => onAreaNameChange(event.currentTarget.value)}
            placeholder="Enter farming area..."
            className="tracker-display h-20 px-6 text-2xl text-foreground placeholder:text-muted-foreground/80 sm:text-4xl"
          />
          {error ? <p className="text-sm text-destructive sm:text-base">{error}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Button className="tracker-action-primary py-7 text-2xl" onClick={onStart}>
            Start Session
          </Button>
          <Button
            variant="outline"
            className="tracker-action-secondary py-7 text-2xl"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>

        <div className="border-t border-border/60 pt-8">
          <div className="space-y-5">
            <SectionLabel>&mdash; Popular Areas &mdash;</SectionLabel>
            <div className="grid gap-4 md:grid-cols-2">
              {popularAreas.map((area) => (
                <button
                  type="button"
                  key={area}
                  className="tracker-panel tracker-display px-6 py-5 text-left text-2xl text-foreground transition-colors hover:border-primary hover:text-primary"
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
