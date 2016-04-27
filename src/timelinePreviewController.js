let timelineController = ($scope, $rootScope) => {
    $scope.frames = $rootScope.frames;

    $scope.remove = (frame) => {
        let idx = $scope.frames.indexOf(frames);
        $scope.frames.splice(idx-1,1);
    }
};

export default timelineController;
