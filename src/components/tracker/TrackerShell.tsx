import type { ReactNode } from "react";

type TrackerShellProps = {
  children?: ReactNode;
  error?: string | null;
};

export function TrackerShell({ children, error = null }: TrackerShellProps) {
  return (
    <main className="tracker-page">
      <div className="tracker-shell">
        {error ? (
          <div className="border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : (
          children
        )}
      </div>
    </main>
  );
}
