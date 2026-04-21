import type { ReactNode } from "react";

type TrackerShellProps = {
  children: ReactNode;
  error?: string | null;
  isLoading?: boolean;
};

export function TrackerShell({
  children,
  error = null,
  isLoading = false,
}: TrackerShellProps) {
  return (
    <main className="tracker-page">
      <div className="tracker-shell">
        {error ? (
          <div className="border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="space-y-3 text-center">
              <p className="tracker-heading text-3xl sm:text-4xl">
                Magic Finding Sessions
              </p>
              <p className="tracker-copy-muted text-base sm:text-lg">
                Loading your tracker...
              </p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </main>
  );
}
