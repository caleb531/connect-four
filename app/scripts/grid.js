'use strict';

var m = require('mithril');
var _ = require('underscore');

function Grid(args) {
  this.columnCount = args.columnCount;
  this.rowCount = args.rowCount;
  // The columns array where columns containing placed chips are stored
  this.columns = [];
  this.resetGrid();
}
// Reset the grid by removing all placed chips
Grid.prototype.resetGrid = function () {
  this.columns.length = 0;
  for (var c = 0; c < this.columnCount; c += 1) {
    this.columns.push([]);
  }
};

Grid.Component = {};

Grid.Component.controller = function () {
  return {
    // Get the CSS translate string for the given coordinate map
    getTranslate: function (coords) {
      return 'translate(' + coords.x + 'px,' + coords.y + 'px)';
    },
    // Set the CSS transform value for the given DOM element
    setTranslate: function (elem, coords) {
      this.pendingChipTranslateX = coords.x;
      this.pendingChipTranslateY = coords.y;
    },
    // Get the left offset of the column currently aligned with the cursor
    getPointerColumnOffsetLeft: function (game, event) {
      var chipWidth = event.currentTarget.offsetWidth / game.grid.columnCount;
      return Math.floor((event.pageX - event.currentTarget.offsetLeft) / chipWidth) * chipWidth;
    },
    // Get the index of the column currently aligned with the cursor
    getPointerColumnIndex: function (game, event) {
      var chipWidth = event.currentTarget.offsetWidth / game.grid.columnCount;
      return Math.floor((event.pageX - event.currentTarget.offsetLeft) / chipWidth);
    },
    // Translate the pending chip to be aligned with whatever the user hovered
    // over (which is guaranteed to be either a chip, chip slot, or grid column)
    getPendingChipTranslate: function (ctrl, game, event) {
      if (game.pendingChip && !game.pendingChipIsFalling) {
        // The currentTarget is always guaranteed to be div#grid
        var pendingChipElem = event.currentTarget.querySelector('.chip.pending');
        if (pendingChipElem) {
          ctrl.setTranslate(pendingChipElem, {
            x: ctrl.getPointerColumnOffsetLeft(game, event),
            y: 0
          });
        }
      }
    },
    // Get the left/top offset of the chip slot element at the given column/row
    getSlotOffset: function (columnIndex, rowIndex) {
      var slotElem = document
        .getElementById('chip-slots')
        .getElementsByClassName('grid-column')[columnIndex]
        .getElementsByClassName('chip-slot')[rowIndex];
      var slotStyle = window.getComputedStyle(slotElem);
      return {
        left: slotElem.offsetLeft - parseInt(slotStyle['margin-left']),
        top: slotElem.offsetTop - parseInt(slotStyle['margin-top'])
      };
    },
    // Place the current pending chip into the next available slot in the column
    // it is hovering over
    placePendingChip: function (ctrl, game, event) {
      if (game.pendingChip && !game.pendingChipIsFalling) {
        var pendingChipElem = event.currentTarget.querySelector('.chip.pending');
        if (!pendingChipElem) {
          return;
        }
        // Get the column/row index where the pending chip is to be placed
        var columnIndex = ctrl.getPointerColumnIndex(game, event);
        var rowIndex = game.getNextAvailableSlot({column: columnIndex});
        // Do not allow user to place chip in column that is already full
        if (rowIndex === null) {
          return;
        }
        game.pendingChipIsFalling = true;
        // Translate chip to the visual position on the grid corresponding to
        // the above column and row
        var slotOffset = ctrl.getSlotOffset(columnIndex, rowIndex);
        ctrl.setTranslate(pendingChipElem, {
          x: slotOffset.left,
          y: slotOffset.top
        });
        // Perform insertion on internal game grid once transition has ended
        pendingChipElem.addEventListener('transitionend', function transitionend() {
          pendingChipElem.removeEventListener('transitionend', transitionend);
          game.placePendingChip({column: columnIndex});
          // Ensure pending chip is removed from DOM since it has been placed
          game.endTurn();
          // Reset position of pending chip to be directly above column where
          // chip was placed just now
          ctrl.pendingChipTranslateX = ctrl.getSlotOffset(game.lastInsertedChipColumn, 0).left;
          ctrl.pendingChipTranslateY = 0;
          m.redraw();
        });
      }
    }
  };
};
Grid.Component.view = function (ctrl, game) {
  var grid = game.grid;
  return m('div#grid', {
    onmousemove: _.partial(ctrl.getPendingChipTranslate, ctrl, game),
    onclick: _.partial(ctrl.placePendingChip, ctrl, game)
  }, [
    // The chip that is about to be placed on the grid
    game.pendingChip ?
      m('div', {
        class: ['chip', 'pending', game.pendingChip.player.color, game.pendingChipIsFalling ? 'is-falling' : ''].join(' '),
        style: {
          transform: ctrl.getTranslate({
            x: ctrl.pendingChipTranslateX,
            y: ctrl.pendingChipTranslateY
          })
        }
      }) : null,
    // Bottom grid of slots (indicating space chips can occupy)
    m('div#chip-slots', _.times(grid.columnCount, function (c) {
      return m('div.grid-column', {'data-column': c}, _.times(grid.rowCount, function (r) {
        return m('div.chip-slot', {'data-column': c, 'data-row': r});
      }));
    })),
    // Top grid of placed chips
    m('div#placed-chips', _.times(grid.columnCount, function (c) {
      return m('div.grid-column', {'data-column': c}, _.map(grid.columns[c], function (chip, r) {
        return m('div', {
          key: 'chip-' + [c, r].join('-'),
          class: ['chip', chip.player.color].join(' '), 'data-column': c, 'data-row': r
        });
      }));
    }))
  ]);
};

module.exports = Grid;
