'use strict';

var m = require('mithril');
var _ = require('underscore');
var classNames = require('classnames');
var Browser = require('../browser');

var GridComponent = {};

GridComponent.controller = function (game) {
  var ctrl = {
    // Reset/initialize the entire state of the controller
    reset: function () {
      // Current CSS position of the pending chip
      ctrl.pendingChipX = 0;
      ctrl.pendingChipY = 0;
      // Booleans indicating when to transition the pending chip's movement in a
      // particular direction (for example, the pending chip should never
      // transition when resetting to its initial position after placing a chip)
      ctrl.transitionPendingChipX = false;
      ctrl.transitionPendingChipY = false;
      // The current CSS position of the column where the user's cursor/finger
      // last clicked/touched
      ctrl.lastVisitedColumnX = 0;
    },
    // Get the CSS translate string for the given coordinate map
    getTranslate: function (coords) {
      return 'translate(' + coords.x + 'px,' + coords.y + 'px)';
    },
    // Update the translation coordinates for the pending chip (this will take
    // effect on the next redraw)
    setPendingChipCoords: function (coords) {
      ctrl.pendingChipX = coords.x;
      ctrl.pendingChipY = coords.y;
    },
    // Retrieve the constant width of a single chip
    getChipWidth: function (grid) {
      var gridElem = document.getElementById('grid');
      return gridElem.offsetWidth / grid.columnCount;
    },
    // Get the index of the last visited column (the column where the cursor was
    // last at or where the last chip was dropped)
    getLastVisitedColumnIndex: function (grid, event) {
      var chipWidth = ctrl.getChipWidth(grid);
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
      var newLastVisitedColumnX = ctrl.getChipWidth(args.game.grid) * args.column;
      if (newLastVisitedColumnX !== ctrl.lastVisitedColumnX) {
        ctrl.lastVisitedColumnX = newLastVisitedColumnX;
        ctrl.setPendingChipCoords({
          x: ctrl.lastVisitedColumnX,
          y: 0
        });
        ctrl.transitionPendingChipX = true;
        ctrl.transitionPendingChipY = false;
        ctrl.waitForPendingChipTransitionEnd(args.game, function () {
          ctrl.transitionPendingChipX = false;
          // Since AI players can't click to place a chip after the chip realigns
          // with the chosen column, place the chip automatically
          if (args.aiAutoPlace && args.game.currentPlayer.type === 'ai') {
            args.game.currentPlayer.wait(function () {
              ctrl.placePendingChip(args);
            });
          }
        });
      }
    },
    // Move the pending chip into alignment with the column nearest to the
    // user's cursor
    movePendingChipViaPointer: function (event) {
      if (game.pendingChip && game.currentPlayer.type === 'human' && !ctrl.transitionPendingChipY) {
        var pointerColumnIndex = ctrl.getLastVisitedColumnIndex(game.grid, event);
        ctrl.movePendingChipToColumn({
          game: game,
          column: pointerColumnIndex
        });
      } else {
        m.redraw.strategy('none');
      }
    },
    // Get the coordinates of the chip slot element at the given column/row
    getSlotCoords: function (args) {
      var chipWidth = ctrl.getChipWidth(args.grid);
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
        m.redraw.strategy('none');
        return;
      }
      var slotCoords = ctrl.getSlotCoords({
        grid: args.game.grid,
        column: args.column,
        row: rowIndex
      });
      // If pending chip is not currently aligned with chosen column
      if (ctrl.pendingChipX !== slotCoords.x) {
        // First move pending chip into alignment with column
        ctrl.movePendingChipToColumn({
          game: args.game,
          column: args.column,
          // On the AI's turn, automatically place the chip after aligning it
          // with the specified column
          aiAutoPlace: true
        });
      } else {
        // Otherwise, chip is already aligned; drop chip into place on grid
        ctrl.transitionPendingChipX = false;
        ctrl.transitionPendingChipY = true;
        // Keep track of where chip was dropped
        ctrl.lastVisitedColumnX = slotCoords.x;
        // Translate chip to the visual position on the grid corresponding to
        // the above column and row
        ctrl.setPendingChipCoords(slotCoords);
        // Perform insertion on internal game grid once transition has ended
        ctrl.finishPlacingPendingChip(args);
      }
      m.redraw();
    },
    // Place the pending chip into the column where the user clicked
    placePendingChipViaPointer: function (event) {
      if (game.pendingChip && game.currentPlayer.type === 'human' && !ctrl.transitionPendingChipX && !ctrl.transitionPendingChipY) {
        ctrl.placePendingChip({
          game: game,
          column: ctrl.getLastVisitedColumnIndex(game.grid, event)
        });
      } else {
        m.redraw.strategy('none');
      }
    },
    // Actually insert the pending chip into the internal grid once the falling
    // transition has ended
    finishPlacingPendingChip: function (args) {
      ctrl.waitForPendingChipTransitionEnd(args.game, function () {
        args.game.placePendingChip({column: args.column});
        ctrl.transitionPendingChipX = false;
        ctrl.transitionPendingChipY = false;
        // Reset position of pending chip to the space directly above the last
        // visited column
        ctrl.setPendingChipCoords({
          x: ctrl.lastVisitedColumnX,
          y: 0
        });
        m.redraw();
      });
    },
    // Configure pending chip element when it's first created
    configurePendingChip: function (pendingChipElem, initialized) {
      // Only configure once per unique DOM element
      if (!initialized) {
        // Ensure that any unfinished pending chip event listeners (from
        // previous games) are unbound
        game.emitter.off('pending-chip:transition-end');
        // Listen for whenever a pending chip transition finishes
        var eventName = Browser.normalizeEventName('transitionend');
        pendingChipElem.addEventListener(eventName, function () {
          game.emitter.emit('pending-chip:transition-end');
        });
      }
    }
  };
  // Place chip automatically when AI computes its next move on its turn
  game.emitter.on('ai-player:compute-next-move', function (aiPlayer, bestMove) {
    // The AI is always the second of the two players
    aiPlayer.wait(function() {
      ctrl.placePendingChip({
        game: game,
        column: bestMove.column
      });
    });
  });
  // Reset controller state when game ends
  game.emitter.on('game:end-game', function () {
    ctrl.reset();
  });
  // Reset controller state whenever controller is initialized
  ctrl.reset();
  return ctrl;
};
GridComponent.view = function (ctrl, game) {
  var grid = game.grid;
  return m('div#grid', {
    class: classNames({'has-winner': game.winner !== null}),
    onmousemove: ctrl.movePendingChipViaPointer,
    onclick: ctrl.placePendingChipViaPointer
  }, [
    // The chip that is about to be placed on the grid
    game.pendingChip ?
      m('div', {
        class: classNames(
          'chip',
          'pending',
          game.pendingChip.player.color,
           {'transition-x': ctrl.transitionPendingChipX},
           {'transition-y': ctrl.transitionPendingChipY}
        ),
        style: Browser.normalizeStyles({
          transform: ctrl.getTranslate({
            x: ctrl.pendingChipX,
            y: ctrl.pendingChipY
          })
        }),
        config: ctrl.configurePendingChip
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
