import m from 'mithril';
import _ from 'underscore';
import Emitter from 'tiny-emitter';
import classNames from '../classnames.js';
import Browser from '../browser.js';

// The grid UI, including the pending chip (i.e. the chip to be placed), as well
// as all chips currently placed on the grid
class GridComponent extends Emitter {

  oninit({ attrs: { game, session } }) {
    this.game = game;
    this.session = session;
    this.grid = this.game.grid;
    // Place chip automatically when AI computes its next move on its turn
    this.game.on('async-player:get-next-move', ({ player, nextMove }) => {
      player.wait(() => {
        this.placePendingChip({
          column: nextMove.column
        });
      });
    });
    // Listen for when the opponent moves their pending chip
    this.session.on('align-pending-chip', ({ column }) => {
      if (!this.transitionPendingChipY) {
        this.alignPendingChipWithColumn({ column });
        m.redraw();
      }
    });
    // Remember the last position of the pending chip when the user rejoins the
    // room or reloads the page
    this.game.on('grid:align-pending-chip-initially', ({ column }) => {
      this.pendingChipX = this.getChipWidth() * column;
      m.redraw();
    });
    // Add a global listener here for all moves we will receive from the
    // opponent (online) player during the course of the game; when we receive a
    // move from the opponent, TinyEmitter will help us resolve the promise
    // created in the most recent OnlinePlayer.getNextMove() call
    this.session.on('receive-next-move', ({ column }) => {
      console.log('receive next move', column);
      this.game.emit('online-player:receive-next-move', { column });
    });
    // When the local (human) player has placed a chip, send that move to the
    // server
    this.game.on('grid:before-finish-placing-pending-chip', ({ player, column }) => {
      // Only chip placements by the local (human) player need to be handled
      if (player.type !== 'online') {
        this.session.emit('place-chip', { column });
      }
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
      const gridElem = document.getElementById('grid');
      this.chipWidth = gridElem.offsetWidth / this.game.grid.columnCount;
    }
    return this.chipWidth;
  }

  // Get the index of the last visited column (the column where the cursor was
  // last at or where the last chip was dropped)
  getLastVisitedColumnIndex(mouseEvent) {
    const chipWidth = this.getChipWidth();
    return Math.max(0, Math.floor((mouseEvent.pageX - mouseEvent.currentTarget.offsetLeft) / chipWidth));
  }

  // Run the given callback when the next (and only the very next) pending
  // chip transition finishes
  waitForPendingChipTransitionEnd(callback) {
    this.off('pending-chip:transition-end');
    this.once('pending-chip:transition-end', callback);
  }

  // Write the alignPendingChip event emitter as a separate function so it can
  // be throttled for performance
  emitAlignEvent({ column }) {
    this.session.emit('align-pending-chip', { column });
  }

  // Horizontally align the pending chip with the specified column
  alignPendingChipWithColumn({ column, transitionEnd, emit = false }) {
    // The last visited column is the grid column nearest to the cursor at
    // any given instant; keep track of the column's X position so the next
    // pending chip can instantaneously appear there
    const newLastVisitedColumnX = this.getChipWidth() * column;
    if (newLastVisitedColumnX !== this.lastVisitedColumnX) {
      if (emit) {
        this.emitAlignEvent({ column });
      }
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
        column: this.getLastVisitedColumnIndex(mousemoveEvent),
        emit: true
      });
    } else {
      mousemoveEvent.redraw = false;
    }
  }

  // Get the coordinates of the chip slot element at the given column/row
  getSlotCoords({ column, row }) {
    const chipWidth = this.getChipWidth();
    return {
      x: chipWidth * column,
      y: chipWidth * (this.game.grid.rowCount - row)
    };
  }

  // Place the pending chip into the specified column (or, if the chip is not
  // currently aligned with said column, do so first without placing it)
  placePendingChip({ column }) {
    const rowIndex = this.game.grid.getNextAvailableSlot({
      column
    });
    // Do not allow user to place chip in column that is already full
    if (rowIndex === null) {
      return;
    }
    const slotCoords = this.getSlotCoords({
      column,
      row: rowIndex
    });
    // If pending chip is not currently aligned with chosen column
    if (this.pendingChipX !== slotCoords.x) {
      // First align pending chip with column
      this.alignPendingChipWithColumn({
        column,
        transitionEnd: () => {
          // When it's the AI's turn or any async player's turn, automatically
          // place the chip after aligning it with the specified column
          if (this.game.currentPlayer.wait) {
            this.game.currentPlayer.wait(() => {
              this.placePendingChip({ column });
            });
          } else {
            // Otherwise, the current player is the local human player (probably
            // on a touch device) and so the alignment event should be emitted
            // to the server
            this.emitAlignEvent({ column });
          }
        }
      });
    } else if (this.transitionPendingChipX) {
      // Detect and prevent a prevent a race condition where placePendingChip is
      // called while the pending chip is still transitioning on the X axis (via
      // alignPendingChipWithColumn), causing the chip to travel diagonally
      // across the board; to fix this, wait for the current alignment
      // transition to finish before starting the placePendingChip transition
      this.waitForPendingChipTransitionEnd(() => {
        // Make sure to reset transitionPendingChipX back to false to prevent
        // the above if statement from executing again upon re-entry of the
        // placePendingChip()
        this.transitionPendingChipX = false;
        this.placePendingChip({ column });
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
    // Send this move to the other (online) player as soon as possible
    this.game.emit('grid:before-finish-placing-pending-chip', {
      player: this.game.currentPlayer,
      column
    });
    this.waitForPendingChipTransitionEnd(() => {
      // Normally, this callback should only ever fire if transitionPendingChipY
      // is true; however, due to strange circumstances (which occur
      // occasionally but not consistently), this callback runs with
      // transitionPendingChipY equal to false, causing the current pending chip
      // to be instantly and unexpectedly placed on the board without any notice
      // or transition; to resolve, we must detect this situation and reset the
      // transition x and y variables
      if (this.transitionPendingChipX && !this.transitionPendingChipY) {
        this.transitionPendingChipX = false;
        this.transitionPendingChipY = false;
      } else {
        this.game.placePendingChip({ column });
        this.transitionPendingChipX = false;
        this.transitionPendingChipY = false;
        // Reset position of pending chip to the space directly above the last
        // visited column
        this.pendingChipX = this.lastVisitedColumnX;
        this.pendingChipY = 0;
        m.redraw();
      }
    });
  }

  // Initialize pending chip element when it's first created
  initializePendingChip({ dom }) {
    // Ensure that any unfinished pending chip event listeners (from
    // previous games) are unbound
    this.off('pending-chip:transition-end');
    // Listen for whenever a pending chip transition finishes
    const eventName = Browser.getNormalizedEventName('transitionend');
    dom.addEventListener(eventName, (event) => {
      // The transitionend DOM event can fire multiple times (undesirably) if
      // the children also have transitions; ensure that the
      // pending-chip:transition-end event is only emitted for the parent's
      // transition; see https://stackoverflow.com/q/26309838/560642
      if (event.target === dom) {
        this.emit('pending-chip:transition-end');
      }
    });
  }

  view() {
    return m('div#grid', {
      onmousemove: (mousemoveEvent) => this.alignPendingChipViaPointer(mousemoveEvent),
      onclick: (clickEvent) => this.placePendingChipViaPointer(clickEvent)
    }, [
      // The chip that is about to be placed on the grid
      this.game.pendingChip ?
        m(`div.chip.pending.${this.game.pendingChip.player.color}`, {
          class: classNames({
            'transition-x': this.transitionPendingChipX,
            'transition-y': this.transitionPendingChipY
          }),
          style: Browser.getNormalizedStyles({
            transform: this.getTranslate({
              x: this.pendingChipX,
              y: this.pendingChipY
            })
          }),
          oncreate: ({ dom }) => this.initializePendingChip({ dom })
        }, [
          m('div.chip-inner.chip-inner-real'),
          // See _grid.scss for how the pending chip inner clone is used
          m('div.chip-inner.chip-inner-clone')
        ]) : null,
      // The part of the grid containing both placed chips and empty chip slots
      m('div#grid-columns', _.times(this.grid.columnCount, (c) => {
        return m('div.grid-column', _.times(this.grid.rowCount, (r) => {
          if (this.grid.columns[c][r]) {
            // If this grid slot is occupied, display the corresponding chip
            const chip = this.grid.columns[c][r];
            return m(`div.chip.${chip.player.color}`, {
              class: classNames({
                'winning': chip.winning
              })
            }, m('div.chip-inner'));
          } else {
            // If this grid slot is empty, display an empty slot circle
            return m('div.empty-chip-slot', {
              key: 'empty-chip-slot-' + [c, r].join('-')
            }, m('div.empty-chip-slot-inner'));
          }
        }));
      }))
    ]);
  }

}

// The time to wait (in ms) before rendering the next pending chip alignment
// from the online player
GridComponent.pendingChipAlignmentDelay = 250;
// Throttle the alignPendingChip event emitter to only fire per the above
// interval
GridComponent.prototype.emitAlignEvent = _.throttle(
  GridComponent.prototype.emitAlignEvent,
  GridComponent.pendingChipAlignmentDelay
);

export default GridComponent;
