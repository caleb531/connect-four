'use strict';

var m = require('mithril');
var _ = require('underscore');
var classNames = require('classnames');
var Browser = require('../browser');

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
    // Update the translation coordinates for the pending chip (this will take
    // effect on the next redraw)
    setPendingChipCoords: function (coords) {
      state.pendingChipX = coords.x;
      state.pendingChipY = coords.y;
    },
    // Retrieve the constant width of a single chip
    getChipWidth: function (grid) {
      var gridElem = document.getElementById('grid');
      return gridElem.offsetWidth / grid.columnCount;
    },
    // Get the index of the last visited column (the column where the cursor was
    // last at or where the last chip was dropped)
    getLastVisitedColumnIndex: function (grid, event) {
      var chipWidth = state.getChipWidth(grid);
      return Math.max(0, Math.floor((event.pageX - event.currentTarget.offsetLeft) / chipWidth));
    },
    // Run the given callback when the next (and only the very next) pending
    // chip transition finishes
    waitForPendingChipTransitionEnd: function (game, callback) {
      game.emitter.off('pending-chip:transition-end');
      game.emitter.once('pending-chip:transition-end', callback);
    },
    // Move the pending chip to be aligned with the specified column
    movePendingChipToColumn: function (args) {
      // The last visited column is the grid column nearest to the cursor at
      // any given instant; keep track of the column's X position so the next
      // pending chip can instantaneously appear there
      var newLastVisitedColumnX = state.getChipWidth(args.game.grid) * args.column;
      if (newLastVisitedColumnX !== state.lastVisitedColumnX) {
        state.lastVisitedColumnX = newLastVisitedColumnX;
        state.setPendingChipCoords({
          x: state.lastVisitedColumnX,
          y: 0
        });
        state.transitionPendingChipX = true;
        state.transitionPendingChipY = false;
        state.waitForPendingChipTransitionEnd(args.game, function () {
          state.transitionPendingChipX = false;
          // Since AI players can't click to place a chip after the chip realigns
          // with the chosen column, place the chip automatically
          if (args.aiAutoPlace && args.game.currentPlayer.type === 'ai') {
            args.game.currentPlayer.wait(function () {
              state.placePendingChip(args);
            });
          }
        });
      }
    },
    // Move the pending chip into alignment with the column nearest to the
    // user's cursor
    movePendingChipViaPointer: function (event) {
      if (game.pendingChip && game.currentPlayer.type === 'human' && !state.transitionPendingChipY) {
        var pointerColumnIndex = state.getLastVisitedColumnIndex(game.grid, event);
        state.movePendingChipToColumn({
          game: game,
          column: pointerColumnIndex
        });
      } else {
        event.redraw = false;
      }
    },
    // Get the coordinates of the chip slot element at the given column/row
    getSlotCoords: function (args) {
      var chipWidth = state.getChipWidth(args.grid);
      return {
        x: chipWidth * args.column,
        y: chipWidth * (args.grid.rowCount - args.row)
      };
    },
    // Place the pending chip into the specified column (or move the chip to
    // that column without placing it if the chip is not currently aligned with
    // the column)
    placePendingChip: function (args) {
      var rowIndex = args.game.grid.getNextAvailableSlot({
        column: args.column
      });
      // Do not allow user to place chip in column that is already full
      if (rowIndex === null) {
        return;
      }
      var slotCoords = state.getSlotCoords({
        grid: args.game.grid,
        column: args.column,
        row: rowIndex
      });
      // If pending chip is not currently aligned with chosen column
      if (state.pendingChipX !== slotCoords.x) {
        // First move pending chip into alignment with column
        state.movePendingChipToColumn({
          game: args.game,
          column: args.column,
          // On the AI's turn, automatically place the chip after aligning it
          // with the specified column
          aiAutoPlace: true
        });
      } else {
        // Otherwise, chip is already aligned; drop chip into place on grid
        state.transitionPendingChipX = false;
        state.transitionPendingChipY = true;
        // Keep track of where chip was dropped
        state.lastVisitedColumnX = slotCoords.x;
        // Translate chip to the visual position on the grid corresponding to
        // the above column and row
        state.setPendingChipCoords(slotCoords);
        // Perform insertion on internal game grid once transition has ended
        state.finishPlacingPendingChip(args);
      }
      m.redraw();
    },
    // Place the pending chip into the column where the user clicked
    placePendingChipViaPointer: function (event) {
      if (game.pendingChip && game.currentPlayer.type === 'human' && !state.transitionPendingChipX && !state.transitionPendingChipY) {
        state.placePendingChip({
          game: game,
          column: state.getLastVisitedColumnIndex(game.grid, event)
        });
      } else {
        event.redraw = false;
      }
    },
    // Actually insert the pending chip into the internal grid once the falling
    // transition has ended
    finishPlacingPendingChip: function (args) {
      state.waitForPendingChipTransitionEnd(args.game, function () {
        args.game.placePendingChip({column: args.column});
        state.transitionPendingChipX = false;
        state.transitionPendingChipY = false;
        // Reset position of pending chip to the space directly above the last
        // visited column
        state.setPendingChipCoords({
          x: state.lastVisitedColumnX,
          y: 0
        });
        m.redraw();
      });
    },
    // Initialize pending chip element when it's first created
    initializePendingChip: function (vnode) {
      // Ensure that any unfinished pending chip event listeners (from
      // previous games) are unbound
      game.emitter.off('pending-chip:transition-end');
      // Listen for whenever a pending chip transition finishes
      var eventName = Browser.normalizeEventName('transitionend');
      vnode.dom.addEventListener(eventName, function () {
        game.emitter.emit('pending-chip:transition-end');
      });
    }
  });
  // Place chip automatically when AI computes its next move on its turn
  game.emitter.on('ai-player:compute-next-move', function (aiPlayer, bestMove) {
    // The AI is always the second of the two players
    aiPlayer.wait(function() {
      state.placePendingChip({
        game: game,
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
  return state;
};
GridComponent.view = function (vnode) {
  var state = vnode.state;
  var game = vnode.attrs.game;
  var grid = game.grid;
  return m('div#grid', {
    class: classNames({'has-winner': game.winner !== null}),
    onmousemove: state.movePendingChipViaPointer,
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
