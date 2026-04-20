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
          <div className="border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:text-base">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="space-y-4 text-center">
              <p className="tracker-heading text-3xl sm:text-5xl">
                Magic Finding Sessions
              </p>
              <p className="tracker-copy-muted text-lg">
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
