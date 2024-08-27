import m from 'mithril';

class ReactionPickerComponent {
  oninit({ attrs: { game, session } }) {
    this.game = game;
    this.session = session;
  }

  sendReaction(reaction) {
    this.session.emit('send-reaction', { reaction });
  }

  view() {
    return (
      <div id="reaction-picker">
        {ReactionPickerComponent.availableReactions.map((reaction) => (
          <div className="available-reaction" onclick={() => this.sendReaction(reaction)}>
            <div className="available-reaction-symbol">{reaction.symbol}</div>
          </div>
        ))}
      </div>
    );
  }
}

ReactionPickerComponent.availableReactions = [
  { symbol: '👏' },
  { symbol: '😁' },
  { symbol: '😮' },
  { symbol: '😭' },
  { symbol: '😉' },
  { symbol: '😬' },
  { symbol: '☕' }
];

export default ReactionPickerComponent;
