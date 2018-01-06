import m from 'mithril';
import _ from 'underscore';
import classNames from 'classnames';
import Browser from '../browser.js';

// The grid UI, including the pending chip (i.e. the chip to be placed), as well
// as all chips currently placed on the grid
class GridComponent {

  oninit(vnode) {
    this.game = vnode.attrs.game;
    this.grid = this.game.grid;
    // Place chip automatically when AI computes its next move on its turn
    this.game.on('ai-player:compute-next-move', (aiPlayer, bestMove) => {
      aiPlayer.wait(() => {
        this.placePendingChip({
          column: bestMove.column
        });
      });
    });
    // Reset controller state when game ends
    this.game.on('game:end', () => this.reset());
    // Reset controller state whenever controller is initialized
    this.reset();
  }

  // Reset/initialize the entire state of the controller
  reset() {
    // The cached width of a single chip
    this.chipWidth = null;
    // Current CSS position of the pending chip
    this.pendingChipX = 0;
    this.pendingChipY = 0;
    // Booleans indicating when to transition the pending chip's movement in a
    // particular direction (for example, the pending chip should never
    // transition when resetting to its initial position after placing a chip)
    this.transitionPendingChipX = false;
    this.transitionPendingChipY = false;
    // The current CSS position of the column where the user's cursor/finger
    // last clicked/touched
    this.lastVisitedColumnX = 0;
  }

  // Get the CSS translate string for the given coordinate map
  getTranslate(coords) {
    return 'translate(' + coords.x + 'px,' + coords.y + 'px)';
  }

  // Retrieve the constant width of a single chip
  getChipWidth() {
    // Cache the width to eliminate successive superfluous reflows
    if (!this.chipWidth) {
      let gridElem = document.getElementById('grid');
      this.chipWidth = gridElem.offsetWidth / this.game.grid.columnCount;
    }
    return this.chipWidth;
  }

  // Get the index of the last visited column (the column where the cursor was
  // last at or where the last chip was dropped)
  getLastVisitedColumnIndex(mouseEvent) {
    let chipWidth = this.getChipWidth();
    return Math.max(0, Math.floor((mouseEvent.pageX - mouseEvent.currentTarget.offsetLeft) / chipWidth));
  }

  // Run the given callback when the next (and only the very next) pending
  // chip transition finishes
  waitForPendingChipTransitionEnd(callback) {
    this.game.off('pending-chip:transition-end');
    this.game.once('pending-chip:transition-end', callback);
  }

  // Horizontally align the pending chip with the specified column
  alignPendingChipWithColumn({ column, transitionEnd }) {
    // The last visited column is the grid column nearest to the cursor at
    // any given instant; keep track of the column's X position so the next
    // pending chip can instantaneously appear there
    let newLastVisitedColumnX = this.getChipWidth() * column;
    if (newLastVisitedColumnX !== this.lastVisitedColumnX) {
      this.lastVisitedColumnX = newLastVisitedColumnX;
      this.pendingChipX = this.lastVisitedColumnX;
      this.pendingChipY = 0;
      this.transitionPendingChipX = true;
      this.transitionPendingChipY = false;
      this.waitForPendingChipTransitionEnd(() => {
        this.transitionPendingChipX = false;
        // Allow the caller of alignPendingChipWithColumn() to provide an
        // arbitrary callback to run when the pending chip transition ends
        if (transitionEnd) {
          transitionEnd();
        }
      });
    }
  }

  // Align the pending chip with the column nearest to the user's cursor
  alignPendingChipViaPointer(mousemoveEvent) {
    if (this.game.pendingChip && this.game.currentPlayer.type === 'human' && !this.transitionPendingChipY) {
      this.alignPendingChipWithColumn({
        column: this.getLastVisitedColumnIndex(mousemoveEvent)
      });
    } else {
      mousemoveEvent.redraw = false;
    }
  }

  // Get the coordinates of the chip slot element at the given column/row
  getSlotCoords({ column, row }) {
    let chipWidth = this.getChipWidth();
    return {
      x: chipWidth * column,
      y: chipWidth * (this.game.grid.rowCount - row)
    };
  }

  // Place the pending chip into the specified column (or, if the chip is not
  // currently aligned with said column, do so first without placing it)
  placePendingChip({ column }) {
    let rowIndex = this.game.grid.getNextAvailableSlot({
      column: column
    });
    // Do not allow user to place chip in column that is already full
    if (rowIndex === null) {
      return;
    }
    let slotCoords = this.getSlotCoords({
      column: column,
      row: rowIndex
    });
    // If pending chip is not currently aligned with chosen column
    if (this.pendingChipX !== slotCoords.x) {
      // First align pending chip with column
      this.alignPendingChipWithColumn({
        column: column,
        // On the AI's turn, automatically place the chip after aligning it
        // with the specified column
        transitionEnd: () => {
          if (this.game.currentPlayer.type === 'ai') {
            this.game.currentPlayer.wait(() => {
              this.placePendingChip({ column });
            });
          }
        }
      });
    } else {
      // Otherwise, chip is already aligned; drop chip into place on grid
      this.transitionPendingChipX = false;
      this.transitionPendingChipY = true;
      // Keep track of where chip was dropped
      this.lastVisitedColumnX = slotCoords.x;
      // Translate chip to the visual position on the grid corresponding to
      // the above column and row
      this.pendingChipX = slotCoords.x;
      this.pendingChipY = slotCoords.y;
      // Perform insertion on internal game grid once transition has ended
      this.finishPlacingPendingChip({ column });
    }
    m.redraw();
  }

  // Place the pending chip into the column where the user clicked
  placePendingChipViaPointer(clickEvent) {
    if (this.game.pendingChip && this.game.currentPlayer.type === 'human' && !this.transitionPendingChipX && !this.transitionPendingChipY) {
      this.placePendingChip({
        column: this.getLastVisitedColumnIndex(clickEvent)
      });
    } else {
      clickEvent.redraw = false;
    }
  }

  // Actually insert the pending chip into the internal grid once the falling
  // transition has ended
  finishPlacingPendingChip({ column }) {
    this.waitForPendingChipTransitionEnd(() => {
      this.game.placePendingChip({column: column});
      this.transitionPendingChipX = false;
      this.transitionPendingChipY = false;
      // Reset position of pending chip to the space directly above the last
      // visited column
      this.pendingChipX = this.lastVisitedColumnX;
      this.pendingChipY = 0;
      m.redraw();
    });
  }

  // Initialize pending chip element when it's first created
  initializePendingChip(vnode) {
    // Ensure that any unfinished pending chip event listeners (from
    // previous games) are unbound
    this.game.off('pending-chip:transition-end');
    // Listen for whenever a pending chip transition finishes
    let eventName = Browser.normalizeEventName('transitionend');
    vnode.dom.addEventListener(eventName, () => {
      this.game.emit('pending-chip:transition-end');
    });
  }

  view() {
    return m('div#grid', {
      onmousemove: (mousemoveEvent) => this.alignPendingChipViaPointer(mousemoveEvent),
      onclick: (clickEvent) => this.placePendingChipViaPointer(clickEvent)
    }, [
      // The chip that is about to be placed on the grid
      this.game.pendingChip ?
        m('div', {
          class: classNames(
            'chip',
            'pending',
            this.game.pendingChip.player.color,
             {'transition-x': this.transitionPendingChipX},
             {'transition-y': this.transitionPendingChipY}
          ),
          style: Browser.normalizeStyles({
            transform: this.getTranslate({
              x: this.pendingChipX,
              y: this.pendingChipY
            })
          }),
          oncreate: (vnode) => this.initializePendingChip(vnode)
        }) : null,
      // The part of the grid containing both placed chips and empty chip slots
      m('div#grid-columns', _.times(this.grid.columnCount, (c) => {
        return m('div.grid-column', _.times(this.grid.rowCount, (r) => {
          if (this.grid.columns[c][r]) {
            // If this grid slot is occupied, display the corresponding chip
            let chip = this.grid.columns[c][r];
            return m('div.chip', {
              class: classNames(
                chip.player.color,
                {'winning': chip.winning}
              )
            });
          } else {
            // If this grid slot is empty, display an empty slot circle
            return m('div.empty-chip-slot', {
              key: 'empty-chip-slot-' + [c, r].join('-')
            });
          }
        }));
      }))
    ]);
  }

}

export default GridComponent;
