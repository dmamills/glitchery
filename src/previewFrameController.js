let previewFrameController = ($scope) => {

    let c = document.createElement('canvas');
    c.width = $scope.frame.data.width;
    c.height = $scope.frame.data.height;

    let ctx = c.getContext('2d');
    ctx.putImageData($scope.frame.data, 0, 0);
    $scope.preview = c.toDataURL();
}

export default previewFrameController;
