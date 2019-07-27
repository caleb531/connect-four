import m from 'mithril';
import ScoreboardComponent from './scoreboard.js';
import ReactionPickerComponent from './reaction-picker.js';

// The player area container which contains both the name/score of each player,
// as well as the reactions UI
class PlayerAreaComponent {

  view({ attrs: { game, session } }) {
    return m('div#player-area', [
      m(ScoreboardComponent, { game, session }),
      session.connected && game.players.length === 2 ? m(ReactionPickerComponent, { game, session }) : null
    ]);
  }

}
export default PlayerAreaComponent;
