let fileUploaderController = ($scope, $rootScope) => {

    let onUpload = (data) => {
        $rootScope.onUpload(data.filepath);
    };

    let uploadForm = document.getElementById('uploadForm');

    $scope.submit = (e) => {
        e.preventDefault();
        fetch('/upload', {
            method: 'post',
            body: new FormData(uploadForm)
        }).then(function(res) {
            return res.json();
        }).then(onUpload, function(err) {
            console.log('error');
        });
    }
}

export default fileUploaderController;
