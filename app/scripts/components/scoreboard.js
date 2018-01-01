import m from 'mithril';
import classNames from 'classnames';

// The area of the game UI that displays each player's current score
var ScoreboardComponent = {};

ScoreboardComponent.view = function (vnode) {
  var game = vnode.attrs.game;
  return m('div#game-scoreboard', game.players.map(function (player) {
    return m('div.player-stats', {class: classNames(player.color)}, [
      m('div.player-name', player.name),
      m('div.player-score', player.score)
    ]);
  }));
};

export default ScoreboardComponent;
