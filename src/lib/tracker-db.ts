import Database from "@tauri-apps/plugin-sql";

import { getDurationMs } from "@/lib/tracker-format";

const DATABASE_NAME = "sqlite:run_tracker.db";

type SessionRow = {
  id: number;
  locationName: string;
  startedAt: string;
  endedAt: string | null;
};

type RunRow = {
  id: number;
  sessionId: number;
  startedAt: string;
  endedAt: string | null;
};

type FarmLocationRow = {
  id: number;
  name: string;
};

let databasePromise: Promise<Database> | null = null;

export type FarmLocation = FarmLocationRow;

export type RunRecord = RunRow & {
  durationMs: number | null;
};

export type CompletedSessionSummary = SessionRow & {
  durationMs: number;
  runs: RunRecord[];
  averageRunMs: number | null;
  fastestRunMs: number | null;
  slowestRunMs: number | null;
  totalRuns: number;
};

export type ActiveSession = SessionRow & {
  endedAt: null;
  runs: RunRecord[];
  activeRun: RunRecord | null;
  completedRuns: RunRecord[];
};

function getDatabase() {
  if (!databasePromise) {
    databasePromise = Database.load(DATABASE_NAME);
  }

  return databasePromise;
}

function mapRun(row: RunRow): RunRecord {
  return {
    ...row,
    durationMs: row.endedAt ? getDurationMs(row.startedAt, row.endedAt) : null,
  };
}

function mapCompletedSession(session: SessionRow, runs: RunRecord[]) {
  const completedRunDurations = runs
    .map((run) => run.durationMs)
    .filter((duration): duration is number => duration !== null);

  return {
    ...session,
    durationMs: getDurationMs(session.startedAt, session.endedAt ?? session.startedAt),
    runs,
    averageRunMs:
      completedRunDurations.length > 0
        ? completedRunDurations.reduce((total, duration) => total + duration, 0) /
          completedRunDurations.length
        : null,
    fastestRunMs:
      completedRunDurations.length > 0 ? Math.min(...completedRunDurations) : null,
    slowestRunMs:
      completedRunDurations.length > 0 ? Math.max(...completedRunDurations) : null,
    totalRuns: completedRunDurations.length,
  } satisfies CompletedSessionSummary;
}

async function getSessionRuns(sessionId: number) {
  const database = await getDatabase();
  const rows = await database.select<RunRow[]>(
    `
      SELECT
        id,
        session_id AS sessionId,
        started_at AS startedAt,
        ended_at AS endedAt
      FROM runs
      WHERE session_id = ?
      ORDER BY started_at ASC, id ASC
    `,
    [sessionId],
  );

  return rows.map(mapRun);
}

async function deleteSession(sessionId: number) {
  const database = await getDatabase();

  await database.execute("DELETE FROM runs WHERE session_id = ?", [sessionId]);
  await database.execute("DELETE FROM sessions WHERE id = ?", [sessionId]);
}

async function ensureFarmLocation(name: string) {
  const database = await getDatabase();
  const existing = await database.select<FarmLocationRow[]>(
    `
      SELECT
        id,
        location_name AS name
      FROM farm_locations
      WHERE lower(location_name) = lower(?)
      LIMIT 1
    `,
    [name],
  );

  if (existing[0]) {
    return existing[0];
  }

  await database.execute("INSERT INTO farm_locations (location_name) VALUES (?)", [
    name,
  ]);

  const inserted = await database.select<FarmLocationRow[]>(
    `
      SELECT
        id,
        location_name AS name
      FROM farm_locations
      WHERE lower(location_name) = lower(?)
      LIMIT 1
    `,
    [name],
  );

  if (!inserted[0]) {
    throw new Error("Unable to create the selected farming area.");
  }

  return inserted[0];
}

export async function getFarmLocations() {
  const database = await getDatabase();
  const rows = await database.select<FarmLocationRow[]>(
    `
      SELECT
        id,
        location_name AS name
      FROM farm_locations
      ORDER BY location_name COLLATE NOCASE ASC
    `,
  );

  return rows;
}

export async function getActiveSession() {
  const database = await getDatabase();
  const rows = await database.select<SessionRow[]>(
    `
      SELECT
        s.id,
        fl.location_name AS locationName,
        s.started_at AS startedAt,
        s.ended_at AS endedAt
      FROM sessions s
      INNER JOIN farm_locations fl ON fl.id = s.farm_location_id
      WHERE s.ended_at IS NULL
      ORDER BY s.started_at DESC, s.id DESC
      LIMIT 1
    `,
  );

  const session = rows[0];

  if (!session) {
    return null;
  }

  const runs = await getSessionRuns(session.id);
  const activeRun =
    [...runs].reverse().find((run) => run.endedAt === null) ?? null;

  return {
    ...session,
    endedAt: null,
    runs,
    activeRun,
    completedRuns: runs.filter((run) => run.endedAt !== null),
  } satisfies ActiveSession;
}

export async function getCompletedSessionSummaries() {
  const database = await getDatabase();
  const sessions = await database.select<SessionRow[]>(
    `
      SELECT
        s.id,
        fl.location_name AS locationName,
        s.started_at AS startedAt,
        s.ended_at AS endedAt
      FROM sessions s
      INNER JOIN farm_locations fl ON fl.id = s.farm_location_id
      WHERE s.ended_at IS NOT NULL
      ORDER BY s.started_at DESC, s.id DESC
    `,
  );

  if (sessions.length === 0) {
    return [];
  }

  const placeholders = sessions.map(() => "?").join(", ");
  const runs = await database.select<RunRow[]>(
    `
      SELECT
        id,
        session_id AS sessionId,
        started_at AS startedAt,
        ended_at AS endedAt
      FROM runs
      WHERE session_id IN (${placeholders})
      ORDER BY started_at ASC, id ASC
    `,
    sessions.map((session) => session.id),
  );

  const runsBySessionId = new Map<number, RunRecord[]>();

  for (const run of runs.map(mapRun)) {
    const sessionRuns = runsBySessionId.get(run.sessionId) ?? [];
    sessionRuns.push(run);
    runsBySessionId.set(run.sessionId, sessionRuns);
  }

  return sessions.map((session) =>
    mapCompletedSession(session, runsBySessionId.get(session.id) ?? []),
  );
}

export async function createSessionAndStartRun(locationName: string) {
  const database = await getDatabase();
  const farmLocation = await ensureFarmLocation(locationName);
  const startedAt = new Date().toISOString();

  const insertResult = await database.execute(
    "INSERT INTO sessions (farm_location_id, started_at) VALUES (?, ?)",
    [farmLocation.id, startedAt],
  );

  if (!insertResult.lastInsertId) {
    throw new Error("Unable to create the new session.");
  }

  await database.execute(
    "INSERT INTO runs (session_id, started_at) VALUES (?, ?)",
    [insertResult.lastInsertId, startedAt],
  );

  const activeSession = await getActiveSession();

  if (!activeSession || activeSession.id !== insertResult.lastInsertId) {
    throw new Error("Unable to start the first run for the new session.");
  }

  return activeSession;
}

export async function startRun(sessionId: number) {
  const database = await getDatabase();
  const startedAt = new Date().toISOString();

  await database.execute(
    "INSERT INTO runs (session_id, started_at) VALUES (?, ?)",
    [sessionId, startedAt],
  );

  const activeSession = await getActiveSession();

  if (!activeSession || activeSession.id !== sessionId) {
    throw new Error("Unable to start a run for the active session.");
  }

  return activeSession;
}

export async function completeRun(runId: number, sessionId: number) {
  const database = await getDatabase();
  const endedAt = new Date().toISOString();

  await database.execute(
    "UPDATE runs SET ended_at = ? WHERE id = ? AND ended_at IS NULL",
    [endedAt, runId],
  );

  const activeSession = await getActiveSession();

  if (!activeSession || activeSession.id !== sessionId) {
    throw new Error("Unable to refresh the active session after ending the run.");
  }

  return activeSession;
}

export async function cancelRun(runId: number, sessionId: number) {
  const database = await getDatabase();

  await database.execute("DELETE FROM runs WHERE id = ? AND ended_at IS NULL", [runId]);

  const remainingRuns = await getSessionRuns(sessionId);

  if (remainingRuns.length === 0) {
    await deleteSession(sessionId);
    return null;
  }

  const activeSession = await getActiveSession();

  if (!activeSession || activeSession.id !== sessionId) {
    throw new Error("Unable to refresh the active session after canceling the run.");
  }

  return activeSession;
}

export async function discardSession(sessionId: number) {
  await deleteSession(sessionId);
}

export async function endSession(sessionId: number) {
  const database = await getDatabase();
  const endedAt = new Date().toISOString();

  await database.execute(
    "UPDATE sessions SET ended_at = ? WHERE id = ? AND ended_at IS NULL",
    [endedAt, sessionId],
  );
}
