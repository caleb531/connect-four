import Player from './player';
import { Optional } from 'utility-types';

// An individual chip/checker that can be placed on a game grid; each chip
// belongs to a single player
class Chip {

  player: Player;
  column: number | null;
  row: number | null;
  winning: boolean;

  constructor({ player, column = null, row = null, winning = false }: Partia<Chip> & Pick<Chip, 'player'>) {
    // A reference to the player who placed this chip
    this.player = player;
    // The index of the column on the grid where this chip was placed
    this.column = column;
    // The index of the row on the grid where this chip was placed
    this.row = row;
    // Whether or not the chip should be visually marked as a winning chip (i.e.
    // apart of a winning connection)
    this.winning = winning;
  }
}

export default Chip;
