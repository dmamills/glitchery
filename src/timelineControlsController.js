import Frame from 'Frame';

let timelineControlsController = ($scope,$rootScope) => {
    
    $scope.frames = $rootScope.frames;
    $scope.interval = 100;
    $scope.isPlaying = false;
    
    $scope.add = function() {
        let f = $rootScope.filterize;
        let interval = $scope.interval;
        let frame = new Frame(f.takeSnapshot(), interval);
        $scope.frames.push(frame);
    }

    $scope.loop = function() {
        let f = $rootScope.filterize;
        if(!$scope.isPlaying) {
            f.loopFrames($scope.frames);
        } else {
            f.stopLoop();
        }

        $scope.isPlaying = !$scope.isPlaying;
    }
};

export default timelineControlsController;
