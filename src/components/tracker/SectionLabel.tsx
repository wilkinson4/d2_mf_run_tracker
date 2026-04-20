import { type ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="tracker-copy-muted text-sm uppercase tracking-[0.3em] sm:text-base">
      {children}
    </div>
  );
}
