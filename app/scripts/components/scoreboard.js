import m from 'mithril';

// The area of the game UI that displays each player's current score
class ScoreboardComponent {

  oninit({ attrs: { game } }) {
    this.game = game;
  }

  view() {
    return m('div#game-scoreboard', this.game.players.map((player) => {
      return m(`div.player-stats.${player.color}`, [
        m('div.player-name', player.name),
        m('div.player-score', player.score)
      ]);
    }));
  }

}

export default ScoreboardComponent;
