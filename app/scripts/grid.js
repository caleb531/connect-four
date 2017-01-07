'use strict';

var m = require('mithril');
var _ = require('underscore');
var classNames = require('classnames');
var Browser = require('./browser');

function Grid(args) {
  this.columnCount = args.columnCount;
  this.rowCount = args.rowCount;
  // The columns array where columns containing placed chips are stored
  this.columns = [];
  this.resetGrid();
}

// Return true if the grid is completely full; otherwise, return false
Grid.prototype.checkIfFull = function () {
  var grid = this;
  return _.every(grid.columns, function (column) {
    return column.length === grid.rowCount;
  });
};

// Reset the grid by removing all placed chips
Grid.prototype.resetGrid = function () {
  this.columns.length = 0;
  for (var c = 0; c < this.columnCount; c += 1) {
    this.columns.push([]);
  }
};

// Return the index of the next available slot for the given column
Grid.prototype.getNextAvailableSlot = function (args) {
  var nextRowIndex = this.columns[args.column].length;
  if (nextRowIndex < this.rowCount) {
    return nextRowIndex;
  } else {
    // Return null if there are no more available slots in this column
    return null;
  }
};

// Find same-color neighbors connected to the given chip in the given direction
Grid.prototype.findConnectedNeighbors = function (chip, direction) {
  var neighbor = chip;
  var connectedNeighbors = [];
  while (true) {
    var nextColumn = neighbor.column + direction.x;
    // Stop if the left/right edge of the grid has been reached
    if (this.columns[nextColumn] === undefined) {
      break;
    }
    var nextRow = neighbor.row + direction.y;
    var nextNeighbor = this.columns[nextColumn][nextRow];
    // Stop if the top/bottom edge of the grid has been reached or if the
    // neighboring slot is empty
    if (nextNeighbor === undefined) {
      break;
    }
    // Stop if this neighbor is not the same color as the original chip
    if (nextNeighbor.player !== chip.player) {
      break;
    }
    // Assume at this point that this neighbor chip is connected to the original
    // chip in the given direction
    neighbor = nextNeighbor;
    connectedNeighbors.push(nextNeighbor);
  }
  return connectedNeighbors;
};

// Get all connections of four chips (including connections of four within
// larger connections) which the last placed chip is apart of
Grid.prototype.getConnections = function (lastPlacedChip) {
  var grid = this;
  var connections = [];
  Grid.connectionDirections.forEach(function (direction) {
    var connection = [lastPlacedChip];
    // Check for connected neighbors in this direction
    connection.push.apply(connection, grid.findConnectedNeighbors(lastPlacedChip, direction));
    // Check for connected neighbors in the opposite direction
    connection.push.apply(connection, grid.findConnectedNeighbors(lastPlacedChip, {
      x: -direction.x,
      y: -direction.y
    }));
    // If at least four connected same-color chips are found, declare winner and
    // highlight connected chips
    if (connection.length >= 4) {
      // Only highlight some group of exactly four chips within that connection
      connection.length = 4;
      connections.push(connection);
    }
  });
  return connections;
};

// The relative directions to check when checking for connected chip neighbors
Grid.connectionDirections = [
  {x: 0, y: -1}, // Bottom-middle
  {x: 1, y: -1}, // Bottom-right
  {x: 1, y: 0}, // Right-middle
  {x: 1, y: 1} // Top-right
];

Grid.Component = {};

Grid.Component.controller = function () {
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
    // Get the left offset of the pointer column
    getPointerColumnX: function (game, event) {
      var chipWidth = event.currentTarget.offsetWidth / game.grid.columnCount;
      return Math.max(0, Math.floor((event.pageX - event.currentTarget.offsetLeft) / chipWidth) * chipWidth);
    },
    // Get the index of the pointer column
    getPointerColumnIndex: function (game, event) {
      var chipWidth = event.currentTarget.offsetWidth / game.grid.columnCount;
      return Math.max(0, Math.floor((event.pageX - event.currentTarget.offsetLeft) / chipWidth));
    },
    // Translate the pending chip to be aligned with the column nearest to the
    // user's pointer
    movePendingChipToPointerColumn: function (ctrl, game, event) {
      if (game.pendingChip) {
        // The pointer column is the grid column nearest to the cursor at any
        // given instant; keep track of the pointer column's X position so the
        // next pending chip can instantaneously appear there
        ctrl.pointerColumnX = ctrl.getPointerColumnX(game, event);
        if (!ctrl.transitionPendingChipY) {
          ctrl.setPendingChipCoords({
            x: ctrl.pointerColumnX,
            y: 0
          });
        }
        ctrl.transitionPendingChipX = true;
      }
    },
    // Get the coordinates of the chip slot element at the given column/row
    getSlotCoords: function (columnIndex, rowIndex) {
      var slotElem = document
        .getElementById('chip-slots')
        .getElementsByClassName('grid-column')[columnIndex]
        .getElementsByClassName('chip-slot')[rowIndex];
      var slotStyle = window.getComputedStyle(slotElem);
      return {
        x: slotElem.offsetLeft - parseInt(slotStyle['margin-left']),
        y: slotElem.offsetTop - parseInt(slotStyle['margin-top'])
      };
    },
    // Place the pending chip into the poiner column's next available slot
    placePendingChip: function (ctrl, game, event) {
      if (game.pendingChip && !ctrl.transitionPendingChipY) {
        var pendingChipElem = event.currentTarget.querySelector('.chip.pending');
        if (!pendingChipElem) {
          return;
        }
        // Get the column/row index where the pending chip is to be placed
        var columnIndex = ctrl.getPointerColumnIndex(game, event);
        var rowIndex = game.grid.getNextAvailableSlot({column: columnIndex});
        // Do not allow user to place chip in column that is already full
        if (rowIndex === null) {
          return;
        }
        var slotCoords = ctrl.getSlotCoords(columnIndex, rowIndex);
        // If pending chip is not currently aligned with pointer column
        if (ctrl.pendingChipX !== slotCoords.x) {
          // First move pending chip into alignment with pointer column
          ctrl.movePendingChipToPointerColumn(ctrl, game, event);
        } else {
          // Otherwise, chip is already aligned; drop chip into place on grid
          ctrl.transitionPendingChipX = false;
          ctrl.transitionPendingChipY = true;
          // Keep track of where chip was dropped on click
          ctrl.pointerColumnX = slotCoords.x;
          // Translate chip to the visual position on the grid corresponding to
          // the above column and row
          ctrl.setPendingChipCoords(slotCoords);
          // Perform insertion on internal game grid once transition has ended
          ctrl.finishPlacingPendingChip(ctrl, game, pendingChipElem, columnIndex);
        }
      }
    },
    // Place the pending chip on the grid once the falling transition has ended
    finishPlacingPendingChip: function (ctrl, game, pendingChipElem, columnIndex) {
      var transitionendEventName = Browser.normalizeEventName('transitionend');
      pendingChipElem.addEventListener(transitionendEventName, function transitionend(event) {
        event.target.removeEventListener(transitionendEventName, transitionend);
        game.placePendingChip({column: columnIndex});
        ctrl.transitionPendingChipX = false;
        ctrl.transitionPendingChipY = false;
        // Reset position of pending chip to be directly above pointer column
        ctrl.setPendingChipCoords({
          x: ctrl.pointerColumnX,
          y: 0
        });
        m.redraw();
      });
    }
  };
};
Grid.Component.view = function (ctrl, game) {
  var grid = game.grid;
  return m('div#grid', {
    onmousemove: _.partial(ctrl.movePendingChipToPointerColumn, ctrl, game),
    onclick: _.partial(ctrl.placePendingChip, ctrl, game)
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
        return m('div.chip-slot');
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

module.exports = Grid;
