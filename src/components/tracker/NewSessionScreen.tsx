import { AlertCircle, MapPin, Play, Swords, X } from "lucide-react";

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
      <SectionHeader
        title="New MF Session"
        icon={<Swords className="size-5 text-primary/70" />}
      />

      <section className="space-y-4">
        <div className="space-y-2">
          <SectionLabel>Area Name</SectionLabel>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              value={areaName}
              onChange={(event) => onAreaNameChange(event.currentTarget.value)}
              placeholder="Enter farming area..."
              className="tracker-input pl-11"
            />
          </div>
          {error ? (
            <p className="flex items-center gap-1.5 text-xs text-destructive sm:text-sm">
              <AlertCircle className="size-3.5 shrink-0" />
              {error}
            </p>
          ) : (
            <p className="text-[0.68rem] text-muted-foreground/70">
              Choose a farming area to begin tracking run times
            </p>
          )}
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <Button
            className="tracker-action-primary h-12 gap-2 text-base"
            onClick={onStart}
          >
            <Play className="size-4" />
            Start Session
          </Button>
          <Button
            variant="outline"
            className="tracker-action-secondary h-12 gap-2 text-base"
            onClick={onCancel}
          >
            <X className="size-4" />
            Cancel
          </Button>
        </div>

        {popularAreas.length > 0 && (
          <div className="border-t border-border/60 pt-3">
            <div className="space-y-3">
              <SectionLabel>&mdash; Quick Pick &mdash;</SectionLabel>
              <div className="grid gap-1.5 md:grid-cols-2">
                {popularAreas.map((area) => (
                  <button
                    type="button"
                    key={area}
                    className="tracker-popular-area flex items-center gap-2.5"
                    onClick={() => onSelectArea(area)}
                  >
                    <MapPin className="size-3.5 shrink-0 text-muted-foreground/60" />
                    {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
