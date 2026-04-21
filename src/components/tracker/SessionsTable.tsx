import {
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
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
  Trash2,
  Zap,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const COLUMN_LABELS: Record<string, string> = {
  id: "Session ID",
  locationName: "Area",
  startedAt: "Date",
  totalRuns: "Runs",
  durationMs: "Duration",
  averageRunMs: "Average",
  fastestRunMs: "Fastest",
};

function DataTableColumnHeader<TData>({
  column,
  icon,
  label,
  className,
}: {
  column: Column<TData, unknown>;
  icon?: ReactNode;
  label: string;
  className?: string;
}) {
  const sorted = column.getIsSorted();
  const SortIcon =
    sorted === "asc" ? ArrowUp : sorted === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "inline-flex h-auto items-center gap-1 rounded-none px-0 py-0 font-[family-name:--font-display] text-[0.56rem] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-transparent hover:text-primary data-[active=true]:text-primary",
        className,
      )}
      data-active={sorted !== false}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {icon}
      {label}
      <SortIcon className="size-2.5" />
    </Button>
  );
}

export function SessionsTable({
  onDeleteSession,
  sessions,
}: {
  onDeleteSession: (sessionId: number) => Promise<void>;
  sessions: CompletedSessionSummary[];
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { desc: true, id: "startedAt" },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const [deleteCandidate, setDeleteCandidate] =
    useState<CompletedSessionSummary | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const columns = useMemo<ColumnDef<CompletedSessionSummary>[]>(
    () => [
      {
        accessorKey: "id",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            icon={<Hash className="size-2.5" />}
            label="#"
          />
        ),
        cell: ({ row }) => (
          <span className="tracker-session-badge">#{row.original.id}</span>
        ),
      },
      {
        accessorKey: "locationName",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            icon={<MapPin className="size-2.5" />}
            label="Area"
          />
        ),
        cell: ({ row }) => (
          <span className="tracker-display text-[0.9rem] text-primary">
            {row.original.locationName}
          </span>
        ),
      },
      {
        accessorKey: "startedAt",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            icon={<Calendar className="size-2.5" />}
            label="Date"
          />
        ),
        cell: ({ row }) => (
          <span className="text-[0.78rem] text-muted-foreground">
            {formatSessionDateShort(row.original.startedAt)}
          </span>
        ),
      },
      {
        accessorKey: "totalRuns",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataTableColumnHeader
              column={column}
              className="justify-center"
              icon={<Repeat2 className="size-2.5" />}
              label="Runs"
            />
          </div>
        ),
        cell: ({ row }) => (
          <span className="flex items-center justify-center gap-1 text-[0.8rem]">
            <Repeat2 className="size-2.5 text-muted-foreground" />
            {row.original.totalRuns}
          </span>
        ),
      },
      {
        accessorKey: "durationMs",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            icon={<Clock className="size-2.5" />}
            label="Duration"
          />
        ),
        cell: ({ row }) => (
          <span className="tracker-display text-[0.85rem]">
            {formatDuration(row.original.durationMs)}
          </span>
        ),
      },
      {
        accessorKey: "averageRunMs",
        sortingFn: (rowA, rowB, columnId) =>
          (rowA.getValue<number | null>(columnId) ?? 0) -
          (rowB.getValue<number | null>(columnId) ?? 0),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            icon={<Timer className="size-2.5" />}
            label="Avg"
          />
        ),
        cell: ({ row }) => (
          <span className="text-[0.78rem] text-muted-foreground">
            {formatDuration(row.original.averageRunMs)}
          </span>
        ),
      },
      {
        accessorKey: "fastestRunMs",
        sortingFn: (rowA, rowB, columnId) =>
          (rowA.getValue<number | null>(columnId) ?? 0) -
          (rowB.getValue<number | null>(columnId) ?? 0),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            icon={<Zap className="size-2.5" />}
            label="Fastest"
          />
        ),
        cell: ({ row }) => (
          <span className="tracker-display text-[0.85rem] text-success">
            {formatDuration(row.original.fastestRunMs)}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              disabled={pendingDeleteId !== null}
              onClick={() => setDeleteCandidate(row.original)}
            >
              <Trash2 className="size-3.5" />
              <span className="sr-only">Delete session #{row.original.id}</span>
            </Button>
          </div>
        ),
      },
    ],
    [pendingDeleteId],
  );

  const table = useReactTable({
    data: sessions,
    columns,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const filteredRowsCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const searchValue =
    (table.getColumn("locationName")?.getFilterValue() as string | undefined) ??
    "";
  const currentPageRows = table.getRowModel().rows;
  const pageStart =
    currentPageRows.length > 0
      ? pagination.pageIndex * pagination.pageSize + 1
      : 0;
  const pageEnd =
    currentPageRows.length > 0
      ? Math.min(
          (pagination.pageIndex + 1) * pagination.pageSize,
          filteredRowsCount,
        )
      : 0;
  const deleteActionLabel = deleteCandidate
    ? `Delete session #${deleteCandidate.id}`
    : "Delete session";

  useEffect(() => {
    const lastPageIndex = Math.max(pageCount - 1, 0);

    if (pagination.pageIndex > lastPageIndex) {
      setPagination((current) => ({
        ...current,
        pageIndex: lastPageIndex,
      }));
    }
  }, [pageCount, pagination.pageIndex]);

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) {
      return;
    }

    setPendingDeleteId(deleteCandidate.id);

    try {
      await onDeleteSession(deleteCandidate.id);
      setDeleteCandidate(null);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (!open && pendingDeleteId === null) {
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => {
              table.getColumn("locationName")?.setFilterValue(e.target.value);
              table.setPageIndex(0);
            }}
            placeholder="Search areas…"
            className="h-9 pl-9 text-sm"
            aria-label="Search sessions by area name"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs text-muted-foreground"
            >
              <SlidersHorizontal className="size-3" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  className="capitalize"
                  onCheckedChange={(checked) =>
                    column.toggleVisibility(Boolean(checked))
                  }
                >
                  {COLUMN_LABELS[column.id]}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="shrink-0 text-xs text-muted-foreground">
          {filteredRowsCount} {filteredRowsCount === 1 ? "session" : "sessions"}
        </span>
      </div>

      <div className="tracker-panel">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border/35 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "py-2.5",
                      header.column.id === "id" && "w-[72px]",
                      header.column.id === "actions" && "w-[52px] text-right",
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {currentPageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  {searchValue
                    ? "No sessions match your search."
                    : "No sessions recorded yet."}
                </TableCell>
              </TableRow>
            ) : (
              currentPageRows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-border/20 transition-colors hover:bg-primary/[0.025]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-2.5",
                        cell.column.id === "actions" && "text-right",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {pageCount > 1 && (
          <div className="flex items-center justify-between border-t border-border/25 px-3 py-2.5">
            <span className="text-[0.7rem] text-muted-foreground">
              {pageStart}–{pageEnd} of {filteredRowsCount}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                aria-label="Next page"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        open={deleteCandidate !== null}
        onOpenChange={handleDeleteDialogOpenChange}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <Trash2 className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>{deleteActionLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteCandidate
                ? `This permanently removes the ${deleteCandidate.locationName} session from ${formatSessionDateShort(deleteCandidate.startedAt)} and deletes all ${deleteCandidate.totalRuns} recorded ${deleteCandidate.totalRuns === 1 ? "run" : "runs"}. This action cannot be undone.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pendingDeleteId !== null}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pendingDeleteId !== null}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmDelete();
              }}
            >
              Delete session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
