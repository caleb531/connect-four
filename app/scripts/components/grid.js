'use strict';

var m = require('mithril');
var _ = require('underscore');
var classNames = require('classnames');
var Browser = require('../browser');

var GridComponent = {};

GridComponent.controller = function () {
  return {
    // Initialize position of pending chip to the leftmost column
    pendingChipX: 0,
    pendingChipY: 0,
    // Booleans indicating when to transition the pending chip's movement in a
    // particular direction (for example, the pending chip should never
    // transition when resetting to its initial position after placing a chip)
    transitionPendingChipX: false,
    transitionPendingChipY: false,
    // Get the CSS translate string for the given coordinate map
    getTranslate: function (coords) {
      return 'translate(' + coords.x + 'px,' + coords.y + 'px)';
    },
    // Update the translation coordinates for the pending chip (this will take
    // effect on the next redraw)
    setPendingChipCoords: function (coords) {
      this.pendingChipX = coords.x;
      this.pendingChipY = coords.y;
    },
    // Retrieve the constant width of a single chip
    getChipWidth: function (grid) {
      var gridElem = document.getElementById('grid');
      return gridElem.offsetWidth / grid.columnCount;
    },
    // Get the index of the last visited column (the column where the cursor was
    // last at or where the last chip was dropped)
    getLastVisitedColumnIndex: function (grid, event) {
      var chipWidth = this.getChipWidth(grid);
      return Math.max(0, Math.floor((event.pageX - event.currentTarget.offsetLeft) / chipWidth));
    },
    // Execute the given callback when the current transition on the pending
    // chip has finished
    onPendingChipTransitionEnd: function (callback) {
      var pendingChipElem = document.querySelector('.chip.pending');
      var eventName = Browser.normalizeEventName('transitionend');
      pendingChipElem.addEventListener(eventName, function transitionend(event) {
        event.target.removeEventListener(eventName, transitionend);
        callback();
        m.redraw();
      });
    },
    // Move the pending chip to be aligned with the specified column
    movePendingChipToColumn: function (args) {
      // The last visited column is the grid column nearest to the cursor at
      // any given instant; keep track of the column's X position so the next
      // pending chip can instantaneously appear there
      this.lastVisitedColumnX = this.getChipWidth(args.game.grid) * args.column;
      this.setPendingChipCoords({
        x: this.lastVisitedColumnX,
        y: 0
      });
      this.transitionPendingChipX = true;
    },
    // Move the pending chip into alignment with the column nearest to the
    // user's cursor
    movePendingChipViaPointer: function (ctrl, game, event) {
      if (game.pendingChip && !ctrl.transitionPendingChipY) {
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
      var chipWidth = this.getChipWidth(args.grid);
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
      var slotCoords = this.getSlotCoords({
        grid: args.game.grid,
        column: args.column,
        row: rowIndex
      });
      // If pending chip is not currently aligned with chosen column
      if (this.pendingChipX !== slotCoords.x) {
        // First move pending chip into alignment with column
        this.movePendingChipToColumn({
          game: args.game,
          column: args.column
        });
        // Uncomment these lines if you want the chip, after realigning with the
        // clicked column, to place itself in that column automatically (this
        // will be the behavior for AI players if a game AI is ever implemented)
        // var ctrl = this;
        // ctrl.onPendingChipTransitionEnd(function () {
        //   ctrl.placePendingChip(args);
        // });
      } else {
        // Otherwise, chip is already aligned; drop chip into place on grid
        this.transitionPendingChipX = false;
        this.transitionPendingChipY = true;
        // Keep track of where chip was dropped
        this.lastVisitedColumnX = slotCoords.x;
        // Translate chip to the visual position on the grid corresponding to
        // the above column and row
        this.setPendingChipCoords(slotCoords);
        // Perform insertion on internal game grid once transition has ended
        this.finishPlacingPendingChip(args);
      }
    },
    // Place the pending chip into the column where the user clicked
    placePendingChipViaPointer: function (ctrl, game, event) {
      if (game.pendingChip && !ctrl.transitionPendingChipY) {
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
      var ctrl = this;
      ctrl.onPendingChipTransitionEnd(function() {
        args.game.placePendingChip({column: args.column});
        ctrl.transitionPendingChipX = false;
        ctrl.transitionPendingChipY = false;
        // Reset position of pending chip to the space directly above the last
        // visited column
        ctrl.setPendingChipCoords({
          x: ctrl.lastVisitedColumnX,
          y: 0
        });
      });
    }
  };
};
GridComponent.view = function (ctrl, game) {
  var grid = game.grid;
  return m('div#grid', {
    class: classNames({'has-winner': game.winner !== null}),
    onmousemove: _.partial(ctrl.movePendingChipViaPointer, ctrl, game),
    onclick: _.partial(ctrl.placePendingChipViaPointer, ctrl, game)
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
        })
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
