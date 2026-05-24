import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'games.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id TEXT PRIMARY KEY,
    room_code TEXT NOT NULL,
    player1_id TEXT NOT NULL,
    player1_name TEXT NOT NULL,
    player1_color TEXT NOT NULL,
    player2_id TEXT,
    player2_name TEXT,
    player2_color TEXT,
    winner_id TEXT,
    winner_color TEXT,
    status TEXT NOT NULL DEFAULT 'in_progress',
    started_at INTEGER NOT NULL,
    ended_at INTEGER,
    total_moves INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS game_moves (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    player_color TEXT NOT NULL,
    column_index INTEGER NOT NULL,
    row_index INTEGER NOT NULL,
    move_number INTEGER NOT NULL,
    placed_at INTEGER NOT NULL
  );
`);

export default db;
