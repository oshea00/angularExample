var app = angular.module("app", ["ui.bootstrap", "ui.date", "restangular", "ngGrid"]);

/* 
 DoubleClick row plugin
*/

function ngGridDoubleClick() {
    var self = this;
    self.$scope = null;
    self.myGrid = null;

    // The init method gets called during the ng-grid directive execution.
    self.init = function (scope, grid, services) {
        // The directive passes in the grid scope and the grid object which
        // we will want to save for manipulation later.
        self.$scope = scope;
        self.myGrid = grid;
        // In this example we want to assign grid events.
        self.assignEvents();
    };
    self.assignEvents = function () {
        // Here we set the double-click event handler to the header container.
        self.myGrid.$viewport.on('dblclick', self.onDoubleClick);
    };
    // double-click function
    self.onDoubleClick = function (event) {
        self.myGrid.config.dblClickFn(self.$scope.selectedItems[0]);
        event.stopPropagation();
    };
}

