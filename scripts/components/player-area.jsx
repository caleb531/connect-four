import m from 'mithril';
import PlayerReactionComponent from './player-reaction.jsx';
import clsx from 'clsx';

// The player area container which contains both the name/score of each player,
// as well as the reactions UI
class PlayerAreaComponent {

  view({ attrs: { game, session } }) {
    return m('div#player-area', [
      m('div#player-area-players', game.players.map((player) => {
        return m('div', {
          class: clsx('player', player.color, {
            'current-player': player === game.currentPlayer,
            'is-reacting': player.lastReaction && player.lastReaction.timer
          })
        }, [
          m('div.player-name', player.name),
          m('div.player-score', player.score),
          m(PlayerReactionComponent, { game, session, player })
        ]);
      }))
    ]);
  }

}
export default PlayerAreaComponent;
