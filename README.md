# Connect Four

_Copyright 2016-2025 Caleb Evans_  
_Released under the MIT License_

[![tests](https://github.com/caleb531/connect-four/actions/workflows/tests.yml/badge.svg)](https://github.com/caleb531/connect-four/actions/workflows/tests.yml)

<!-- [![Coverage Status](https://coveralls.io/repos/github/caleb531/connect-four/badge.svg?branch=main)](https://coveralls.io/github/caleb531/connect-four?branch=main) -->

This is the slickest Connect Four app around, written using HTML5, JavaScript,
and Mithril (a React-like framework). You can play on your phone or computer,
with a friend or against Mr. A.I.

You can play the app online at:  
https://connectfour.calebevans.me/

## Features

- **1-Player mode** — play against the built-in minimax AI
- **2-Player mode** — local hotseat play
- **Online multiplayer** — share a room link and play with anyone
- **Room List** — browse open rooms and join or spectate live games at `/rooms`
- **Game history** — every completed game and all moves are stored in a local SQLite database
- **Bot / automation API** — a REST API for scripted or AI-driven players (no WebSocket required)

## Implementation

### User interface

The entire app UI is constructed and managed in JavaScript using
[Mithril][mithril]. Chip transitions are handled by CSS to maximize performance
and smoothness. The grid layout is styled with CSS Flexbox to enable the
stacking of grid elements from the bottom up.

[mithril]: http://mithril.js.org/

### AI Player

Like many traditional board game AIs, my Connect Four AI uses the
[minimax][minimax] algorithm. For my particular implementation, I've chosen to
use a maximum search depth of three (meaning the AI examines possibilities up to
three turns into the future). This is combined with [alpha-beta pruning][abp] to
dramatically reduce the number of possibilities evaluated.

My scoring heuristic works by counting connections of chips that intersect with
an empty slot, giving exponentially more weight to larger connections. For
example, every single chip touching an empty slot is worth four points, a
connect-two is worth nine points, a connect-three is worth sixteen points, and
so on. A winning connection of four or more chips is given the maximum/minimum
score.

In the app, the AI player is lovingly referred to as "Mr. AI".

[minimax]: https://en.wikipedia.org/wiki/Minimax
[abp]: https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning

### Game storage

All online games are persisted to a local SQLite database (`data/games.db`)
using Node's built-in [`node:sqlite`][node-sqlite] module (available since
Node 22.5, stable in Node 24). Two tables are maintained:

- **`games`** — one row per game, recording both players, the winner, start/end
  times, total move count, and final status (`in_progress`, `completed`, or
  `abandoned`)
- **`game_moves`** — one row per chip placement, recording the player, column,
  row, move number, and timestamp

[node-sqlite]: https://nodejs.org/api/sqlite.html

## Run the project locally

### 1. Install global dependencies

The project requires Node (>= 24), so make sure you have that installed.

### 2. Install project dependencies

This project uses [pnpm][pnpm] (instead of npm) for package installation and
management. From the cloned project directory, run:

[pnpm]: https://pnpm.io/

```bash
npm install -g pnpm
pnpm install
```

### 3. Serve app locally

To serve the app locally, run:

```bash
pnpm dev
```

You will then be able to view the app at `http://localhost:8080`. Any app files
are recompiled automatically when you make changes to them (as long as
`pnpm dev` is still running).

## REST API

All endpoints return JSON. The bot endpoints accept JSON request bodies.

### Rooms

#### `GET /api/rooms`

Returns a list of all currently active rooms.

```json
[
  {
    "code": "ABCD",
    "playerCount": 2,
    "players": [
      { "name": "Alice", "color": "red" },
      { "name": "Bob",   "color": "blue" }
    ],
    "status": "inProgress",
    "createdAt": 1714320000000
  }
]
```

`status` is either `"waitingForPlayers"` or `"inProgress"`.

### Game history

#### `GET /api/games`

Returns up to 50 games ordered by start time (newest first). Accepts optional
query parameters `limit` (max 200) and `offset`.

#### `GET /api/games/:id`

Returns a single game record plus a `moves` array containing every chip
placement in order.

```json
{
  "id": "...",
  "room_code": "ABCD",
  "player1_name": "Alice",
  "player2_name": "Bob",
  "winner_color": "red",
  "status": "completed",
  "started_at": 1714320000000,
  "ended_at": 1714320300000,
  "total_moves": 12,
  "moves": [
    { "move_number": 1, "player_color": "blue", "column_index": 3, "row_index": 0 },
    ...
  ]
}
```

### Bot / automation API

These endpoints let any external program play a full game over HTTP without a
WebSocket connection. Bots can play against each other or against a human
player; human clients receive the normal WebSocket events as moves arrive.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/bot/open-room` | Open a room as Player 1 |
| `POST` | `/api/bot/join-room` | Join as Player 2 and start the game |
| `GET` | `/api/bot/state/:roomCode` | Poll game state and `yourTurn` flag |
| `POST` | `/api/bot/place-chip` | Place a chip in a column (0–6) |
| `POST` | `/api/bot/end-game` | Signal intent to stop the current game |
| `POST` | `/api/bot/new-game` | Request or accept a rematch; submit winner |
| `POST` | `/api/bot/close-room` | Remove the room and mark game abandoned |

#### Open a room as Player 1

```
POST /api/bot/open-room
{ "player": { "name": "MyBot", "color": "red" } }
→ { roomCode, playerId, game }
```

#### Join a room as Player 2 (starts the game immediately)

```
POST /api/bot/join-room
{ "roomCode": "ABCD", "player": { "name": "MyBot", "color": "blue" } }
→ { playerId, game }
```

#### Poll game state

```
GET /api/bot/state/:roomCode?playerId=<id>
→ { game, yourTurn, playerCount }
```

Poll this until `yourTurn` is `true`, then place a chip.

#### Place a chip

```
POST /api/bot/place-chip
{ "roomCode": "ABCD", "playerId": "<id>", "column": 3 }
→ { status, column, game }
```

Column is 0-indexed. Returns `400` if it is not your turn or the column is full.

#### Request or accept a new game

```
POST /api/bot/new-game
{ "roomCode": "ABCD", "playerId": "<id>", "winner": { "color": "red" } }
```

Pass `winner: null` for a draw. Both players must call this endpoint; the
second call records the result and starts the next game.

### Minimal bot example

```js
const base = 'http://localhost:8080/api/bot';
const post = (path, body) =>
  fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then((r) => r.json());

const { roomCode, playerId: p1 } = await post('/open-room', {
  player: { name: 'Bot1', color: 'red' }
});

const { playerId: p2 } = await post('/join-room', {
  roomCode,
  player: { name: 'Bot2', color: 'blue' }
});

const players = { red: p1, blue: p2 };

for (let col = 0; col < 7; col++) {
  const { game } = await fetch(`${base}/state/${roomCode}`).then((r) => r.json());
  if (!game.inProgress) break;
  await post('/place-chip', { roomCode, playerId: players[game.currentPlayer], column: col });
}

await post('/close-room', { roomCode, playerId: p1 });
```
