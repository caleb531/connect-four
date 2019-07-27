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
    return m('div#reaction-picker', ReactionPickerComponent.availableReactions.map((reaction) => {
      return m('div.available-reaction', m('div.available-reaction-symbol', {
        onclick: () => this.sendReaction(reaction)
      }, reaction.symbol));
    }));
  }

}

ReactionPickerComponent.availableReactions = [
  { symbol: '👏' },
  { symbol: '😁' },
  { symbol: '😮' },
  { symbol: '😭' },
  { symbol: '😬' },
  { symbol: '🙈' }
];

export default ReactionPickerComponent;
