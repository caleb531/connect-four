import m from 'mithril';
import classNames from '../classnames.js';
import PlayerReactionComponent from './player-reaction.js';

// The player area container which contains both the name/score of each player,
// as well as the reactions UI
class PlayerAreaComponent {

  view({ attrs: { game, session } }) {
    return m('div#player-area', [
      m('div#player-area-players', game.players.map((player) => {
        return m(`div.player.${player.color}`, {
          class: classNames({
            'current-player': player === game.currentPlayer,
            'is-reacting': player.reaction && player.reaction.timer
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
