(function() {

var GameComponent = {
  controller: function () {},
  view: function (ctrl) {
    return [
      m(GameGridComponent, {
        columnCount: 7,
        rowCount: 6,
        chipSize: 50,
        chipMargin: 6
      })
    ];
  }
};

var GameGridComponent = {
  controller: function () {
    return {
      getStyleStr: function (styles) {
        var declarations = [];
        for (var propName in styles) {
          if (styles.hasOwnProperty(propName)) {
            declarations.push(propName + ':' + styles[propName]);
          }
        }
        return declarations.join(';');
      },
      getGridStyle: function (columnCount, rowCount, chipSize, chipMargin) {
        var gridWidth = columnCount * (chipSize + (chipMargin * 2));
        var gridHeight = rowCount * (chipSize + (chipMargin * 2));
        return this.getStyleStr({
          width: gridWidth + 'px',
          height: gridHeight + 'px'
        });
      },
      getChipStyle: function (c, r, chipSize, chipMargin) {
        var chipX = c * (chipSize + (chipMargin * 2)) + chipMargin;
        var chipY = r * (chipSize + (chipMargin * 2)) + chipMargin;
        return this.getStyleStr({
          width: chipSize + 'px',
          height: chipSize + 'px',
          transform: 'translate(' + chipX + 'px,' + chipY + 'px)'
        });
      },
      count: function (start, end, fn) {
        var items = [];
        for (var i = start; i < end; i += 1) {
          items.push(fn(i));
        }
        return items;
      }
    };
  },
  view: function (ctrl, args) {
    return m('div', {id: 'grid', style: ctrl.getGridStyle(args.columnCount, args.rowCount, args.chipSize, args.chipMargin)},
      ctrl.count(0, args.columnCount, function (c) {
        return m('div', {class: 'column'}, ctrl.count(0, args.rowCount, function (r) {
          return m('div', {
            key: 'chip-' + c + '-' + r,
            class: 'chip-placeholder',
            style: ctrl.getChipStyle(c, r, args.chipSize, args.chipMargin)
          });
        }));
      })
    );
  }
};

m.mount(document.getElementById('game'), GameComponent);

}());
