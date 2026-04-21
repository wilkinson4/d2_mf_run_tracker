import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Hash,
  MapPin,
  Repeat2,
  Search,
  SlidersHorizontal,
  Timer,
  Zap,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CompletedSessionSummary } from "@/lib/tracker-db";
import { formatDuration, formatSessionDateShort } from "@/lib/tracker-format";

type SortKey =
  | "id"
  | "locationName"
  | "startedAt"
  | "totalRuns"
  | "durationMs"
  | "averageRunMs"
  | "fastestRunMs";

type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

function ColHeader({
  colKey,
  icon,
  label,
  sortKey,
  sortDir,
  onSort,
}: {
  colKey: SortKey;
  icon?: ReactNode;
  label: string;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const isActive = sortKey === colKey;
  const SortIcon = isActive
    ? sortDir === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 font-[family-name:--font-display] text-[0.56rem] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-primary"
      data-active={isActive}
      onClick={() => onSort(colKey)}
    >
      {icon}
      {label}
      <SortIcon className="size-2.5" />
    </button>
  );
}

export function SessionsTable({
  sessions,
}: {
  sessions: CompletedSessionSummary[];
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("startedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q
      ? sessions.filter((s) => s.locationName.toLowerCase().includes(q))
      : sessions;
  }, [sessions, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id":
          cmp = a.id - b.id;
          break;
        case "locationName":
          cmp = a.locationName.localeCompare(b.locationName);
          break;
        case "startedAt":
          cmp = a.startedAt.localeCompare(b.startedAt);
          break;
        case "totalRuns":
          cmp = a.totalRuns - b.totalRuns;
          break;
        case "durationMs":
          cmp = a.durationMs - b.durationMs;
          break;
        case "averageRunMs":
          cmp = (a.averageRunMs ?? 0) - (b.averageRunMs ?? 0);
          break;
        case "fastestRunMs":
          cmp = (a.fastestRunMs ?? 0) - (b.fastestRunMs ?? 0);
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const colHeaderProps = { sortKey, sortDir, onSort: handleSort };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search areas…"
            className="h-9 pl-9 text-sm"
            aria-label="Search sessions by area name"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-xs text-muted-foreground"
        >
          <SlidersHorizontal className="size-3" />
          Filter
        </Button>
        <span className="shrink-0 text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "session" : "sessions"}
        </span>
      </div>

      {/* Table */}
      <div className="tracker-panel">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/35 hover:bg-transparent">
              <TableHead className="w-[60px] py-2.5">
                <ColHeader
                  colKey="id"
                  icon={<Hash className="size-2.5" />}
                  label=""
                  {...colHeaderProps}
                />
              </TableHead>
              <TableHead className="py-2.5">
                <ColHeader
                  colKey="locationName"
                  icon={<MapPin className="size-2.5" />}
                  label="Area"
                  {...colHeaderProps}
                />
              </TableHead>
              <TableHead className="py-2.5">
                <ColHeader
                  colKey="startedAt"
                  icon={<Calendar className="size-2.5" />}
                  label="Date"
                  {...colHeaderProps}
                />
              </TableHead>
              <TableHead className="py-2.5 text-center">
                <ColHeader
                  colKey="totalRuns"
                  icon={<Repeat2 className="size-2.5" />}
                  label="Runs"
                  {...colHeaderProps}
                />
              </TableHead>
              <TableHead className="py-2.5">
                <ColHeader
                  colKey="durationMs"
                  icon={<Clock className="size-2.5" />}
                  label="Duration"
                  {...colHeaderProps}
                />
              </TableHead>
              <TableHead className="py-2.5">
                <ColHeader
                  colKey="averageRunMs"
                  icon={<Timer className="size-2.5" />}
                  label="Avg"
                  {...colHeaderProps}
                />
              </TableHead>
              <TableHead className="py-2.5">
                <ColHeader
                  colKey="fastestRunMs"
                  icon={<Zap className="size-2.5" />}
                  label="Fastest"
                  {...colHeaderProps}
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  {search
                    ? "No sessions match your search."
                    : "No sessions recorded yet."}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((session) => (
                <TableRow
                  key={session.id}
                  className="border-b border-border/20 transition-colors hover:bg-primary/[0.025]"
                >
                  <TableCell className="py-2.5">
                    <span className="tracker-session-badge">#{session.id}</span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="tracker-display text-[0.9rem] text-primary">
                      {session.locationName}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="text-[0.78rem] text-muted-foreground">
                      {formatSessionDateShort(session.startedAt)}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="flex items-center gap-1 text-[0.8rem]">
                      <Repeat2 className="size-2.5 text-muted-foreground" />
                      {session.totalRuns}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="tracker-display text-[0.85rem]">
                      {formatDuration(session.durationMs)}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="text-[0.78rem] text-muted-foreground">
                      {formatDuration(session.averageRunMs)}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="tracker-display text-[0.85rem] text-success">
                      {formatDuration(session.fastestRunMs)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/25 px-3 py-2.5">
            <span className="text-[0.7rem] text-muted-foreground">
              {page * PAGE_SIZE + 1}–
              {Math.min((page + 1) * PAGE_SIZE, sorted.length)} of{" "}
              {sorted.length}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
