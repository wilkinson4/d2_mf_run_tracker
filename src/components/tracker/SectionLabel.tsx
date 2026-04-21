import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="tracker-copy-muted text-[0.625rem] uppercase tracking-[0.3em] sm:text-[0.65rem]">
      {children}
    </div>
  );
}
