import m from 'mithril';
import classNames from '../classnames.js';

class PlayerReactionComponent {

  oninit({ attrs: { session, player } }) {
    session.on('send-reaction', ({ reactingPlayer, reaction }) => {
      if (reactingPlayer.color === player.color) {
        // Immediately update the reaction if another reaction was sent before
        // the current reaction disappears
        clearTimeout(player.reaction ? player.reaction.timer : null);
        player.reaction = reaction;
        // The reaction should disappear after the specified duration
        player.reaction.timer = setTimeout(() => {
          player.reaction.timer = null;
          m.redraw();
        }, PlayerReactionComponent.reactionDuration);
        m.redraw();
      }
    });
  }

  view({ attrs: { player } }) {
    return m('div.player-reaction', m('div.player-reaction-symbol', {
      class: classNames({ 'show': player.reaction && player.reaction.timer })
    }, player.reaction ? player.reaction.symbol : null));
  }

}

// The duration a reaction is shown before disappearing
PlayerReactionComponent.reactionDuration = 1500;

export default PlayerReactionComponent;
