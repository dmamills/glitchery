let filterSelectionController = ($scope, $rootScope, filterService) => {

    $scope.filters = filterService;

    $scope.selectedFilter = filterService[0];
    $rootScope.selectedFilter = $scope.selectedFilter;
    $scope.selectedFilter.selected = true;

    $scope.$watch('brushSize', (nv,ov) => {
        if(!nv) return;
        $rootScope.filterize.setBrushSize(nv);
    });

    $scope.select = (filter) => {
        $scope.selectedFilter.selected = false;
        filter.selected = true;
        $scope.selectedFilter = filter;
    }
}


export default filterSelectionController;
