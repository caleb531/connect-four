(function() {

var GameComponent = {};
GameComponent.view = function () {
  return [
    m(GridComponent, new Grid({
        columnCount: 7,
        rowCount: 6,
        chipSize: 50,
        chipMargin: 6
      })
    )
  ];
};

function Grid(args) {
  this.columnCount = args.columnCount;
  this.rowCount = args.rowCount;
  this.chipSize = args.chipSize;
  this.chipMargin = args.chipMargin;
  // The columns array where columns containing placed chips are stored
  this.columns = [];
  this.resetGrid();
}
// Reset the grid by removing all placed chips
Grid.prototype.resetGrid = function () {
  this.columns.length = 0;
  var p1 = new Player({color: 'red'});
  for (var c = 0; c < this.columnCount; c += 1) {
    this.columns.push([]);
  }
};

function Chip(args) {
  this.player = args.player;
}

function Player(args) {
  this.color = args.color;
}

var GridComponent = {};
GridComponent.controller = function () {
  return {
    getColumnStyle: function (grid) {
      var gridWidth = grid.chipSize + (grid.chipMargin * 2);
      var gridHeight = grid.rowCount * (grid.chipSize + (grid.chipMargin * 2));
      return {
        width: gridWidth + 'px',
        height: gridHeight + 'px'
      };
    },
    getChipStyle: function (c, r, grid) {
      var chipX = c * (grid.chipSize + (grid.chipMargin * 2)) + grid.chipMargin;
      var chipY = r * (grid.chipSize + (grid.chipMargin * 2)) + grid.chipMargin;
      return {
        width: grid.chipSize + 'px',
        height: grid.chipSize + 'px',
        transform: 'translate(' + chipX + 'px,' + chipY + 'px)'
      };
    }
  };
};
GridComponent.view = function (ctrl, grid) {
  return m('div', {id: 'grid'},
    _.times(grid.columnCount, function (c) {
      return m('div', {class: 'grid-column', style: ctrl.getColumnStyle(grid)}, _.times(grid.rowCount, function (r) {
        return m('div', {
          class: 'chip-placeholder',
          style: ctrl.getChipStyle(c, r, grid)
        });
      }).concat(_.forEach(grid.columns[c], function (chip, r) {
        return m('div', {
          class: ['chip', chip.player.color].join(' '),
          style: ctrl.getChipStyle(c, r, grid)
        });
      })));
    })
  );
};

m.mount(document.getElementById('game'), GameComponent);

}());
