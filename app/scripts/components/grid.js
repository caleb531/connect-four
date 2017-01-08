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
    // Get the index of the last visited column (the column where the pointer
    // was last at or where the last chip was dropped)
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
      });
    },
    movePendingChipToColumn: function (args) {
      if (args.game.pendingChip) {
        // The last visited column is the grid column nearest to the cursor at
        // any given instant; keep track of the column's X position so the next
        // pending chip can instantaneously appear there
        this.lastVisitedColumnX = this.getChipWidth(args.game.grid) * args.column;
        if (!this.transitionPendingChipY) {
          this.setPendingChipCoords({
            x: this.lastVisitedColumnX,
            y: 0
          });
        }
        this.transitionPendingChipX = true;
      }
    },
    // Translate the pending chip to be aligned with the column nearest to the
    // user's pointer
    movePendingChipViaPointer: function (ctrl, game, event) {
      if (game.pendingChip) {
        var pointerColumnIndex = ctrl.getLastVisitedColumnIndex(game.grid, event);
        ctrl.movePendingChipToColumn({
          game: game,
          column: pointerColumnIndex
        });
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
    // Place the pending chip programmatically using the specified column
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
    // Place the pending chip into the poiner column's next available slot
    placePendingChipViaPointer: function (ctrl, game, event) {
      if (game.pendingChip && !ctrl.transitionPendingChipY) {
        ctrl.placePendingChip({
          game: game,
          column: ctrl.getLastVisitedColumnIndex(game.grid, event)
        });
      }
    },
    // Place the pending chip on the grid once the falling transition has ended
    finishPlacingPendingChip: function (args) {
      var ctrl = this;
      ctrl.onPendingChipTransitionEnd(function() {
        args.game.placePendingChip({column: args.column});
        ctrl.transitionPendingChipX = false;
        ctrl.transitionPendingChipY = false;
        // Reset position of pending chip to be directly above the last visited
        // column
        ctrl.setPendingChipCoords({
          x: ctrl.lastVisitedColumnX,
          y: 0
        });
        m.redraw();
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
