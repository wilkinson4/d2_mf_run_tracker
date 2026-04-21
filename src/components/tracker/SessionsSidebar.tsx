import { Activity, Flame, MapPin, Trophy } from "lucide-react";
import { useMemo } from "react";

import type { CompletedSessionSummary } from "@/lib/tracker-db";
import { formatDuration, formatSessionDateShort } from "@/lib/tracker-format";

function SidebarPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="tracker-panel px-4 py-3.5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted-foreground/70">{icon}</span>
        <h3 className="tracker-heading text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function SidebarStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-t border-border/25 py-1.5 first:border-t-0 first:pt-0">
      <span className="text-[0.68rem] text-muted-foreground">{label}</span>
      <span
        className={
          highlight
            ? "tracker-display text-[0.82rem] text-success"
            : "tracker-display text-[0.82rem] text-primary"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function SessionsSidebar({
  sessions,
}: {
  sessions: CompletedSessionSummary[];
}) {
  const stats = useMemo(() => {
    if (sessions.length === 0) return null;

    const totalSessions = sessions.length;
    const totalRuns = sessions.reduce((s, x) => s + x.totalRuns, 0);
    const totalTimeMs = sessions.reduce((s, x) => s + x.durationMs, 0);

    const validFastest = sessions.filter((s) => s.fastestRunMs !== null);
    const fastestRun =
      validFastest.length > 0
        ? Math.min(...validFastest.map((s) => s.fastestRunMs as number))
        : null;

    const validAvg = sessions.filter((s) => s.averageRunMs !== null);
    const bestAvgSession =
      validAvg.length > 0
        ? Math.min(...validAvg.map((s) => s.averageRunMs as number))
        : null;

    // Area counts
    const areaCounts = new Map<string, number>();
    for (const s of sessions) {
      areaCounts.set(s.locationName, (areaCounts.get(s.locationName) ?? 0) + 1);
    }
    const topAreas = [...areaCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // This-week stats
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const thisWeekSessions = sessions.filter(
      (s) => new Date(`${s.startedAt.replace(" ", "T")}Z`) >= weekStart,
    );
    const thisWeekRuns = thisWeekSessions.reduce((s, x) => s + x.totalRuns, 0);

    const lastSession = sessions.reduce((latest, s) =>
      s.startedAt > latest.startedAt ? s : latest,
    );

    return {
      totalSessions,
      totalRuns,
      totalTimeMs,
      fastestRun,
      bestAvgSession,
      topAreas,
      thisWeekSessionCount: thisWeekSessions.length,
      thisWeekRuns,
      lastSessionDate: lastSession.startedAt,
    };
  }, [sessions]);

  if (!stats) {
    return (
      <div className="tracker-panel flex min-h-40 items-center justify-center px-4 py-6 text-center text-xs text-muted-foreground">
        Complete a session to see stats here.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <SidebarPanel
        title="All-Time Records"
        icon={<Trophy className="size-3.5" />}
      >
        <SidebarStat label="Sessions" value={stats.totalSessions} />
        <SidebarStat label="Total Runs" value={stats.totalRuns} />
        <SidebarStat
          label="Total Time"
          value={formatDuration(stats.totalTimeMs)}
        />
        <SidebarStat
          label="Fastest Run"
          value={formatDuration(stats.fastestRun)}
          highlight
        />
        <SidebarStat
          label="Best Avg Session"
          value={formatDuration(stats.bestAvgSession)}
          highlight
        />
      </SidebarPanel>

      <SidebarPanel
        title="Top Farming Areas"
        icon={<Flame className="size-3.5" />}
      >
        {stats.topAreas.map(([area, count], i) => (
          <div
            key={area}
            className="flex items-center gap-2 border-t border-border/25 py-1.5 first:border-t-0 first:pt-0"
          >
            <span className="tracker-display shrink-0 text-[0.6rem] text-muted-foreground/60">
              {i + 1}
            </span>
            <MapPin className="size-2.5 shrink-0 text-muted-foreground/50" />
            <span className="tracker-display min-w-0 flex-1 truncate text-[0.78rem] text-foreground">
              {area}
            </span>
            <span className="shrink-0 text-[0.68rem] text-muted-foreground">
              {count}×
            </span>
          </div>
        ))}
      </SidebarPanel>

      <SidebarPanel
        title="Recent Activity"
        icon={<Activity className="size-3.5" />}
      >
        <SidebarStat
          label="Last Session"
          value={formatSessionDateShort(stats.lastSessionDate)}
        />
        <SidebarStat
          label="This Week"
          value={`${stats.thisWeekSessionCount} session${stats.thisWeekSessionCount !== 1 ? "s" : ""}`}
        />
        <SidebarStat label="Runs This Week" value={stats.thisWeekRuns} />
      </SidebarPanel>
    </div>
  );
}
