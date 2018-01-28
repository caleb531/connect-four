import m from 'mithril';
import classNames from 'classnames';

// The area of the game UI that displays each player's current score
class ScoreboardComponent {

  oninit(vnode) {
    this.game = vnode.attrs.game;
  }

  view() {
    return m('div#game-scoreboard', this.game.players.map(function (player) {
      return m('div.player-stats', { class: classNames(player.color) }, [
        m('div.player-name', player.name),
        m('div.player-score', player.score)
      ]);
    }));
  }

}

export default ScoreboardComponent;
