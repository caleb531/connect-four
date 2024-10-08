import m from 'mithril';
import clsx from 'clsx';

class PlayerReactionComponent {
  oninit({ attrs: { session, player } }) {
    this.player = player;
    session.on('send-reaction', ({ reactingPlayer, reaction }) => {
      if (reactingPlayer.color === this.player.color) {
        // Immediately update the reaction if another reaction was sent before
        // the current reaction disappears
        clearTimeout(this.player.lastReaction ? this.player.lastReaction.timer : null);
        this.player.lastReaction = reaction;
        // The reaction should disappear after the specified duration
        this.player.lastReaction.timer = setTimeout(() => {
          if (this.player.lastReaction) {
            this.player.lastReaction.timer = null;
          }
          m.redraw();
        }, PlayerReactionComponent.reactionDuration);
        m.redraw();
      }
    });
  }

  // The oninit() call (and therefore the send-reaction listener) only runs once
  // for the lifetime of this component instance, however the player object may
  // change during that time, so we need to ensure the above listener has a
  // dynamic reference to the freshest instance of the player
  onupdate({ attrs: { player } }) {
    this.player = player;
  }

  view({ attrs: { player } }) {
    return (
      <div className="player-reaction">
        <div
          className={clsx('player-reaction-symbol', {
            show: player.lastReaction && player.lastReaction.timer
          })}
        >
          {player.lastReaction ? player.lastReaction.symbol : null}
        </div>
      </div>
    );
  }
}

// The duration a reaction is shown before disappearing
PlayerReactionComponent.reactionDuration = 1500;

export default PlayerReactionComponent;
