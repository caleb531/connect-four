import { expect } from '@playwright/test';
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
    const chip = new Chip({ player: currentPlayer });
    game.grid.placeChip({ column, chip });
    if (currentPlayer === game.players[0]) {
      currentPlayer = game.players[1];
    } else {
      currentPlayer = game.players[0];
    }
  });
}

// Add syntactic sugar assertion for testing CSS translate values
expect.extend({
  toBeOneOf: (received, choices) => {
    if (choices.includes(received)) {
      return {
        message: () => `expected ${received} to be in [${choices.join(', ')}]`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} not to be in [${choices.join(', ')}]`,
        pass: false
      };
    }
  }
});

export default {
  placeChips
};
