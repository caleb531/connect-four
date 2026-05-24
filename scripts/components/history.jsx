import m from 'mithril';

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function duration(startedAt, endedAt) {
  if (!startedAt || !endedAt) return '—';
  const secs = Math.round((endedAt - startedAt) / 1000);
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

class HistoryComponent {
  oninit() {
    this.games = [];
    this.loading = true;
    this.error = null;
    this.loadGames();
  }

  loadGames() {
    m.request({ method: 'GET', url: '/api/games' })
      .then((games) => {
        this.games = games;
        this.loading = false;
      })
      .catch(() => {
        this.error = 'Failed to load history.';
        this.loading = false;
      });
  }

  view() {
    return (
      <div id="history">
        <h1>Connect Four</h1>
        <h2>Game History</h2>
        {this.loading ? (
          <p className="history-message">Loading...</p>
        ) : this.error ? (
          <p className="history-message history-error">{this.error}</p>
        ) : this.games.length === 0 ? (
          <p className="history-message">No games recorded yet.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Players</th>
                <th>Winner</th>
                <th>Moves</th>
                <th>Duration</th>
                <th>Result</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.games.map((g) => {
                const isDraw = g.status === 'completed' && !g.winner_color;
                const isAbandoned = g.status === 'abandoned';
                const isInProgress = g.status === 'in_progress';
                return (
                  <tr key={g.id} className={isAbandoned ? 'abandoned' : ''}>
                    <td className="history-date">{formatDate(g.started_at)}</td>
                    <td className="history-players">
                      <span className={`history-player ${g.player1_color}`}>
                        {g.player1_name}
                      </span>
                      <span className="history-vs">vs</span>
                      <span className={`history-player ${g.player2_color || ''}`}>
                        {g.player2_name || '—'}
                      </span>
                    </td>
                    <td className={`history-winner ${g.winner_color || ''}`}>
                      {g.winner_color === g.player1_color
                        ? g.player1_name
                        : g.winner_color === g.player2_color
                          ? g.player2_name
                          : '—'}
                    </td>
                    <td className="history-moves">{g.total_moves}</td>
                    <td className="history-duration">{duration(g.started_at, g.ended_at)}</td>
                    <td className="history-status">
                      {isInProgress ? (
                        <span className="badge in-progress">Live</span>
                      ) : isDraw ? (
                        <span className="badge draw">Draw</span>
                      ) : isAbandoned ? (
                        <span className="badge abandoned">Abandoned</span>
                      ) : (
                        <span className="badge completed">Completed</span>
                      )}
                    </td>
                    <td className="history-replay">
                      {g.total_moves > 0 ? (
                        <a href={`/history/${g.id}`}>Replay</a>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div className="history-footer">
          <button onclick={() => this.loadGames()} disabled={this.loading}>
            Refresh
          </button>
          <a href="/rooms">Browse Rooms</a>
          <a href="/">Home</a>
        </div>
      </div>
    );
  }
}

export default HistoryComponent;
