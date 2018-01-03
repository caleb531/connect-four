import Chip from '../../app/scripts/models/chip';

// Place chips at the given columns with the given players
function placeChips(args) {
  let currentPlayer;
  if (args && args.startingPlayer) {
    currentPlayer = args.startingPlayer;
  } else {
    currentPlayer = args.game.players[0];
  }
  args.columns.forEach(function (column) {
    let chip = new Chip({player: currentPlayer});
    args.game.grid.placeChip({column: column, chip: chip});
    if (currentPlayer === args.game.players[0]) {
      currentPlayer = args.game.players[1];
    } else {
      currentPlayer = args.game.players[0];
    }
  });
}

module.exports = {
  placeChips: placeChips
};
