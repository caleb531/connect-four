// An individual chip/checker that can be placed on a game grid; each chip
// belongs to a single player
function Chip({ player }) {
  // A reference to the player who placed this chip
  this.player = player;
  // The index of the column on the grid where this chip was placed
  this.column = null;
  // The index of the row on the grid where this chip was placed
  this.row = null;
  // Whether or not the chip should be visually marked as a winning chip (i.e.
  // apart of a winning connection)
  this.winning = false;
}

export default Chip;
