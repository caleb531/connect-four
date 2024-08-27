import m from 'mithril';
import PlayerReactionComponent from './player-reaction.jsx';
import clsx from 'clsx';

// The player area container which contains both the name/score of each player,
// as well as the reactions UI
class PlayerAreaComponent {
  view({ attrs: { game, session } }) {
    return (
      <div id="player-area">
        <div id="player-area-players">
          {game.players.map((player) => (
            <div
              className={clsx('player', player.color, {
                'current-player': player === game.currentPlayer,
                'is-reacting': player.lastReaction && player.lastReaction.timer
              })}
            >
              <div className="player-name">{player.name}</div>
              <div className="player-score">{player.score}</div>
              <PlayerReactionComponent game={game} session={session} player={player} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default PlayerAreaComponent;
