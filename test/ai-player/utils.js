import Chip from '../../app/scripts/models/chip.js';

// Place chips at the given columns with the given players
function placeChips({ game, startingPlayer, columns }) {
  let currentPlayer;
  if (startingPlayer) {
    currentPlayer = startingPlayer;
  } else {
    currentPlayer = game.players[0];
  }
  columns.forEach(function (column) {
    let chip = new Chip({player: currentPlayer});
    game.grid.placeChip({column: column, chip: chip});
    if (currentPlayer === game.players[0]) {
      currentPlayer = game.players[1];
    } else {
      currentPlayer = game.players[0];
    }
  });
}

module.exports = {
  placeChips: placeChips
};
