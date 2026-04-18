CREATE TABLE IF NOT EXISTS farm_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    farm_location_id INTEGER NOT NULL,
    FOREIGN KEY (farm_location_id) REFERENCES farm_locations(id)
);

CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE INDEX IF NOT EXISTS idx_runs_session_id ON runs (session_id);
CREATE INDEX IF NOT EXISTS idx_runs_started_at ON runs (started_at);
CREATE INDEX IF NOT EXISTS idx_runs_ended_at ON runs (ended_at);

CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions (started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_ended_at ON sessions (ended_at);
CREATE INDEX IF NOT EXISTS idx_sessions_farm_location_id ON sessions (farm_location_id);


INSERT INTO farm_locations (location_name) VALUES
('Ancient Tunnels'),
('Andariel'),
('Arcane Sanctuary'),
('Baal'),
('Chaos Sanctuary'),
('Drifter Cavern'),
('Duriel'),
('Eldritch'),
('Icy Cellar'),
('Lower Kurast'),
('Maggot Lair'),
('Mausoleum'),
('Mephisto'),
('Nihlathak'),
('Pindleskin'),
('Secret Cow Level'),
('Shenk'),
('Tal Rasha''s Tombs'),
('The Pit'),
('Travincal'),
('Worldstone Keep');
