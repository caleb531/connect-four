import m from 'mithril';

class ReactionPickerComponent {

  // oninit({ attrs: { game, session, roomCode } }) {
  //   session.on('receive-reaction', ({ reaction }) => {
  //
  //   });
  // }

  view() {
    return m('div#reaction-picker', ReactionPickerComponent.availableReactions.map((reaction) => {
      return m('div.available-reaction', m('div.available-reaction-symbol', reaction.symbol));
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
