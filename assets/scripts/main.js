(function() {

var GameComponent = {
  controller: function () {},
  view: function (ctrl) {
    return [
      m(GridComponent, new Grid({
          columnCount: 7,
          rowCount: 6,
          chipSize: 50,
          chipMargin: 6
        })
      )
    ];
  }
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
  for (var c = 0; c < this.columnCount; c += 1) {
    this.columns.push([]);
  }
};

var GridComponent = {
  controller: function () {
    return {
      getGridStyle: function (grid) {
        var gridWidth = grid.columnCount * (grid.chipSize + (grid.chipMargin * 2));
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
  },
  view: function (ctrl, grid) {
    return m('div', {id: 'grid', style: ctrl.getGridStyle(grid)},
      _.times(grid.columnCount, function (c) {
        return m('div', {class: 'column'}, _.times(grid.rowCount, function (r) {
          return m('div', {
            class: 'chip-placeholder',
            style: ctrl.getChipStyle(c, r, grid)
          });
        }));
      })
    );
  }
};

m.mount(document.getElementById('game'), GameComponent);

}());
