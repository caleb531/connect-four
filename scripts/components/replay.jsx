import clsx from 'clsx';
import m from 'mithril';

const COLS = 7;
const ROWS = 6;

// Directions to check for a 4-in-a-row: horizontal, vertical, two diagonals
const DIRECTIONS = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1]
];

// Build a columns[c][r] grid state from the first `count` moves in the moves array
function buildColumns(moves, count) {
  const columns = Array.from({ length: COLS }, () => []);
  for (let i = 0; i < count; i++) {
    const { column_index, player_color } = moves[i];
    columns[column_index].push({ color: player_color });
  }
  return columns;
}

// Return a Set of "c,r" keys for chips that form a winning connection
function findWinners(columns) {
  const get = (c, r) => columns[c]?.[r];
  const winners = new Set();
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const chip = get(c, r);
      if (!chip) continue;
      for (const [dc, dr] of DIRECTIONS) {
        const seq = [];
        for (let k = 0; k < 4; k++) {
          if (get(c + dc * k, r + dr * k)?.color === chip.color) {
            seq.push(`${c + dc * k},${r + dr * k}`);
          }
        }
        if (seq.length === 4) seq.forEach((key) => winners.add(key));
      }
    }
  }
  return winners;
}

class ReplayComponent {
  oninit({ attrs }) {
    this.gameId = attrs.gameId;
    this.game = null;
    this.moves = [];
    this.stepIndex = 0;
    this.playing = false;
    this.playSpeed = 700;
    this.playTimer = null;
    this.loading = true;
    this.error = null;
    this.loadGame();
  }

  onremove() {
    this.pause();
  }

  loadGame() {
    m.request({ method: 'GET', url: `/api/games/${this.gameId}` })
      .then((data) => {
        this.game = data;
        this.moves = data.moves || [];
        this.loading = false;
      })
      .catch(() => {
        this.error = 'Failed to load game.';
        this.loading = false;
      });
  }

  get atStart() {
    return this.stepIndex === 0;
  }

  get atEnd() {
    return this.stepIndex === this.moves.length;
  }

  seek(index) {
    this.stepIndex = Math.max(0, Math.min(index, this.moves.length));
    if (this.atEnd) this.pause();
  }

  stepBack() {
    this.seek(this.stepIndex - 1);
  }

  stepForward() {
    this.seek(this.stepIndex + 1);
  }

  play() {
    if (this.atEnd) this.seek(0);
    this.playing = true;
    this.scheduleNextStep();
    m.redraw();
  }

  pause() {
    this.playing = false;
    clearTimeout(this.playTimer);
    this.playTimer = null;
  }

  togglePlay() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  scheduleNextStep() {
    this.playTimer = setTimeout(() => {
      this.stepIndex++;
      if (this.atEnd) {
        this.pause();
      } else {
        this.scheduleNextStep();
      }
      m.redraw();
    }, this.playSpeed);
  }

  setSpeed(ms) {
    this.playSpeed = ms;
    if (this.playing) {
      clearTimeout(this.playTimer);
      this.scheduleNextStep();
    }
  }

  view() {
    if (this.loading) {
      return (
        <div id="replay">
          <h1>Connect Four</h1>
          <p className="replay-message">Loading...</p>
        </div>
      );
    }
    if (this.error) {
      return (
        <div id="replay">
          <h1>Connect Four</h1>
          <p className="replay-message replay-error">{this.error}</p>
          <div className="replay-footer">
            <a href="/history">← History</a>
          </div>
        </div>
      );
    }

    const columns = buildColumns(this.moves, this.stepIndex);
    const isGameOver = this.atEnd && this.game.status === 'completed';
    const winners = isGameOver && this.game.winner_color ? findWinners(columns) : new Set();
    const currentMove = this.stepIndex > 0 ? this.moves[this.stepIndex - 1] : null;

    const nameOf = (color) =>
      color === this.game.player1_color ? this.game.player1_name : this.game.player2_name;

    let statusText;
    if (this.atEnd) {
      if (this.game.winner_color) {
        statusText = `${nameOf(this.game.winner_color)} wins!`;
      } else if (this.game.status === 'completed') {
        statusText = "It's a draw!";
      } else {
        statusText = 'Game abandoned';
      }
    } else if (this.stepIndex === 0) {
      statusText = 'Press play or use the controls to step through the game';
    } else {
      statusText = `Move ${this.stepIndex} — ${nameOf(currentMove.player_color)} placed in column ${currentMove.column_index + 1}`;
    }

    return (
      <div id="replay">
        <h1>Connect Four</h1>
        <h2>Replay</h2>

        <div className="replay-players">
          <span className={`replay-player ${this.game.player1_color}`}>
            {this.game.player1_name}
          </span>
          <span className="replay-vs">vs</span>
          <span className={`replay-player ${this.game.player2_color || ''}`}>
            {this.game.player2_name || '—'}
          </span>
        </div>

        <p className="replay-status">{statusText}</p>

        {/* Board */}
        <div
          id="replay-grid-columns"
          className={clsx({ 'game-over': isGameOver, 'has-winner': !!this.game.winner_color })}
        >
          {Array.from({ length: COLS }, (_, c) => (
            <div key={c} className="grid-column">
              {Array.from({ length: ROWS }, (_, r) => {
                const chip = columns[c][r];
                const isWinner = winners.has(`${c},${r}`);
                const isLastPlaced =
                  currentMove &&
                  currentMove.column_index === c &&
                  currentMove.row_index === r;
                return chip ? (
                  <div
                    key={r}
                    className={clsx('chip', chip.color, {
                      winning: isWinner,
                      'last-placed': isLastPlaced
                    })}
                  >
                    <div className="chip-inner"></div>
                  </div>
                ) : (
                  <div key={r} className="empty-chip-slot">
                    <div className="empty-chip-slot-inner"></div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Scrubber */}
        <div className="replay-scrubber">
          <span className="replay-step-count">
            {this.stepIndex} / {this.moves.length}
          </span>
          <input
            type="range"
            min="0"
            max={this.moves.length}
            value={this.stepIndex}
            oninput={(e) => {
              this.pause();
              this.seek(parseInt(e.target.value));
            }}
          />
        </div>

        {/* Transport controls */}
        <div className="replay-controls">
          <button
            onclick={() => {
              this.pause();
              this.seek(0);
            }}
            disabled={this.atStart}
            title="Reset"
          >
            ⏮
          </button>
          <button
            onclick={() => {
              this.pause();
              this.stepBack();
            }}
            disabled={this.atStart}
            title="Step back"
          >
            ⏴
          </button>
          <button className="play-pause" onclick={() => this.togglePlay()} title={this.playing ? 'Pause' : 'Play'}>
            {this.playing ? '⏸' : '▶'}
          </button>
          <button
            onclick={() => {
              this.pause();
              this.stepForward();
            }}
            disabled={this.atEnd}
            title="Step forward"
          >
            ⏵
          </button>
          <button
            onclick={() => {
              this.pause();
              this.seek(this.moves.length);
            }}
            disabled={this.atEnd}
            title="Jump to end"
          >
            ⏭
          </button>
        </div>

        {/* Speed selector */}
        <div className="replay-speed">
          <span className="replay-speed-label">Speed:</span>
          {[
            ['Slow', 1200],
            ['Normal', 700],
            ['Fast', 300]
          ].map(([label, ms]) => (
            <button
              key={label}
              className={clsx({ active: this.playSpeed === ms })}
              onclick={() => this.setSpeed(ms)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="replay-footer">
          <a href="/history">← History</a>
          <a href="/">Home</a>
        </div>
      </div>
    );
  }
}

export default ReplayComponent;
