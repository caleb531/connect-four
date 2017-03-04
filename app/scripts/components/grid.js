'use strict';

var m = require('mithril');
var _ = require('underscore');
var classNames = require('classnames');
var Browser = require('../browser');

// The grid UI, including the pending chip (i.e. the chip to be placed), as well
// as all chips currently placed on the grid
var GridComponent = {};

GridComponent.oninit = function (vnode) {
  var game = vnode.attrs.game;
  var state = vnode.state;
  Object.assign(state, {
    // Reset/initialize the entire state of the controller
    reset: function () {
      // Current CSS position of the pending chip
      state.pendingChipX = 0;
      state.pendingChipY = 0;
      // Booleans indicating when to transition the pending chip's movement in a
      // particular direction (for example, the pending chip should never
      // transition when resetting to its initial position after placing a chip)
      state.transitionPendingChipX = false;
      state.transitionPendingChipY = false;
      // The current CSS position of the column where the user's cursor/finger
      // last clicked/touched
      state.lastVisitedColumnX = 0;
    },
    // Get the CSS translate string for the given coordinate map
    getTranslate: function (coords) {
      return 'translate(' + coords.x + 'px,' + coords.y + 'px)';
    },
    // Retrieve the constant width of a single chip
    getChipWidth: function () {
      var gridElem = document.getElementById('grid');
      return gridElem.offsetWidth / game.grid.columnCount;
    },
    // Get the index of the last visited column (the column where the cursor was
    // last at or where the last chip was dropped)
    getLastVisitedColumnIndex: function (mouseEvent) {
      var chipWidth = state.getChipWidth();
      return Math.max(0, Math.floor((mouseEvent.pageX - mouseEvent.currentTarget.offsetLeft) / chipWidth));
    },
    // Run the given callback when the next (and only the very next) pending
    // chip transition finishes
    waitForPendingChipTransitionEnd: function (callback) {
      game.emitter.off('pending-chip:transition-end');
      game.emitter.once('pending-chip:transition-end', callback);
    },
    // Horizontally align the pending chip with the specified column
    alignPendingChipWithColumn: function (args) {
      // The last visited column is the grid column nearest to the cursor at
      // any given instant; keep track of the column's X position so the next
      // pending chip can instantaneously appear there
      var newLastVisitedColumnX = state.getChipWidth(game.grid) * args.column;
      if (newLastVisitedColumnX !== state.lastVisitedColumnX) {
        state.lastVisitedColumnX = newLastVisitedColumnX;
        state.pendingChipX = state.lastVisitedColumnX;
        state.pendingChipY = 0;
        state.transitionPendingChipX = true;
        state.transitionPendingChipY = false;
        state.waitForPendingChipTransitionEnd(function () {
          state.transitionPendingChipX = false;
          // Allow the caller of alignPendingChipWithColumn() to provide an
          // arbitrary callback to run when the pending chip transition ends
          if (args.transitionEnd) {
            args.transitionEnd();
          }
        });
      }
    },
    // Align the pending chip with the column nearest to the user's cursor
    alignPendingChipViaPointer: function (mousedownEvent) {
      if (game.pendingChip && game.currentPlayer.type === 'human' && !state.transitionPendingChipY) {
        var pointerColumnIndex = state.getLastVisitedColumnIndex(mousedownEvent);
        state.alignPendingChipWithColumn({
          column: pointerColumnIndex
        });
      } else {
        mousedownEvent.redraw = false;
      }
    },
    // Get the coordinates of the chip slot element at the given column/row
    getSlotCoords: function (args) {
      var chipWidth = state.getChipWidth(game.grid);
      return {
        x: chipWidth * args.column,
        y: chipWidth * (game.grid.rowCount - args.row)
      };
    },
    // Place the pending chip into the specified column (or, if the chip is not
    // currently aligned with said column, do so first without placing it)
    placePendingChip: function (args) {
      var rowIndex = game.grid.getNextAvailableSlot({
        column: args.column
      });
      // Do not allow user to place chip in column that is already full
      if (rowIndex === null) {
        return;
      }
      var slotCoords = state.getSlotCoords({
        column: args.column,
        row: rowIndex
      });
      // If pending chip is not currently aligned with chosen column
      if (state.pendingChipX !== slotCoords.x) {
        // First align pending chip with column
        state.alignPendingChipWithColumn({
          column: args.column,
          // On the AI's turn, automatically place the chip after aligning it
          // with the specified column
          transitionEnd: function () {
            if (game.currentPlayer.type === 'ai') {
              game.currentPlayer.wait(function () {
                state.placePendingChip(args);
              });
            }
          }
        });
      } else {
        // Otherwise, chip is already aligned; drop chip into place on grid
        state.transitionPendingChipX = false;
        state.transitionPendingChipY = true;
        // Keep track of where chip was dropped
        state.lastVisitedColumnX = slotCoords.x;
        // Translate chip to the visual position on the grid corresponding to
        // the above column and row
        state.pendingChipX = slotCoords.x;
        state.pendingChipY = slotCoords.y;
        // Perform insertion on internal game grid once transition has ended
        state.finishPlacingPendingChip(args);
      }
      m.redraw();
    },
    // Place the pending chip into the column where the user clicked
    placePendingChipViaPointer: function (clickEvent) {
      if (game.pendingChip && game.currentPlayer.type === 'human' && !state.transitionPendingChipX && !state.transitionPendingChipY) {
        state.placePendingChip({
          column: state.getLastVisitedColumnIndex(clickEvent)
        });
      } else {
        clickEvent.redraw = false;
      }
    },
    // Actually insert the pending chip into the internal grid once the falling
    // transition has ended
    finishPlacingPendingChip: function (args) {
      state.waitForPendingChipTransitionEnd(function () {
        game.placePendingChip({column: args.column});
        state.transitionPendingChipX = false;
        state.transitionPendingChipY = false;
        // Reset position of pending chip to the space directly above the last
        // visited column
        state.pendingChipX = state.lastVisitedColumnX;
        state.pendingChipY = 0;
        m.redraw();
      });
    },
    // Initialize pending chip element when it's first created
    initializePendingChip: function (pendingChipVnode) {
      // Ensure that any unfinished pending chip event listeners (from
      // previous games) are unbound
      game.emitter.off('pending-chip:transition-end');
      // Listen for whenever a pending chip transition finishes
      var eventName = Browser.normalizeEventName('transitionend');
      pendingChipVnode.dom.addEventListener(eventName, function () {
        game.emitter.emit('pending-chip:transition-end');
      });
    }
  });
  // Place chip automatically when AI computes its next move on its turn
  game.emitter.on('ai-player:compute-next-move', function (aiPlayer, bestMove) {
    aiPlayer.wait(function () {
      state.placePendingChip({
        column: bestMove.column
      });
    });
  });
  // Reset controller state when game ends
  game.emitter.on('game:end-game', function () {
    state.reset();
  });
  // Reset controller state whenever controller is initialized
  state.reset();
};
GridComponent.view = function (vnode) {
  var state = vnode.state;
  var game = vnode.attrs.game;
  var grid = game.grid;
  return m('div#grid', {
    class: classNames({'has-winner': game.winner !== null}),
    onmousemove: state.alignPendingChipViaPointer,
    onclick: state.placePendingChipViaPointer
  }, [
    // The chip that is about to be placed on the grid
    game.pendingChip ?
      m('div', {
        class: classNames(
          'chip',
          'pending',
          game.pendingChip.player.color,
           {'transition-x': state.transitionPendingChipX},
           {'transition-y': state.transitionPendingChipY}
        ),
        style: Browser.normalizeStyles({
          transform: state.getTranslate({
            x: state.pendingChipX,
            y: state.pendingChipY
          })
        }),
        oncreate: state.initializePendingChip
      }) : null,
    // Bottom grid of slots (indicating space chips can occupy)
    m('div#chip-slots', _.times(grid.columnCount, function (c) {
      return m('div.grid-column', _.times(grid.rowCount, function (r) {
        return m('div.chip-slot', {
          class: classNames({
            'filled': grid.columns[c][r] !== undefined
          })
        });
      }));
    })),
    // Top grid of placed chips
    m('div#placed-chips', _.times(grid.columnCount, function (c) {
      return m('div.grid-column', _.map(grid.columns[c], function (chip, r) {
        return m('div', {
          key: 'chip-' + [c, r].join('-'),
          class: classNames(
            'chip',
            'placed',
            chip.player.color,
            {'highlighted': chip.highlighted}
          )
        });
      }));
    }))
  ]);
};

module.exports = GridComponent;
