import Filterize from 'filterize-canvas';

import toolBoxController from 'toolBoxController';
import filterSelectionController from 'filterSelectionController';
import fileControlsController from 'fileControlsController';
import fileUploaderController from 'fileUploaderController';
import timelinePreviewController from 'timelinePreviewController';
import timelineControlsController from 'timelineControlsController';
import previewFrameController from 'previewFrameController';

import filterService from 'filterService';

angular.module('filterize', ['ngModal'])

//Controllers
.controller('filterSelectionController', filterSelectionController)
.controller('toolBoxController', toolBoxController)
.controller('fileControlsController', fileControlsController)
.controller('fileUploaderController', fileUploaderController)
.controller('timelinePreviewController', timelinePreviewController)
.controller('timelineControlsController', timelineControlsController)
.controller('previewFrameController', previewFrameController)

//Services
.service('filterService', filterService)

//Directives
.directive('toolBox', function() {
    return {
        restrict: 'E',
        templateUrl: 'tpls/toolBox.tpl.html',
        controller: 'toolBoxController'
    }
})
.directive('filterSelection', () => {
    return {
        restrict: 'E',
        templateUrl: 'tpls/filterSelection.tpl.html',
        controller: 'filterSelectionController'
    };
})
.directive('fileControls', () => {
    return {
        restrict: 'E',
        templateUrl: 'tpls/fileControls.tpl.html',
        controller: 'fileControlsController'
    }
})
.directive('fileUploader', () => {
    return {
        restrict: 'E',
        templateUrl: 'tpls/fileUploader.tpl.html',
        controller: 'fileUploaderController'
    }
})
.directive('timelinePreview', () => {
    return {
        restrict: 'E',
        templateUrl: 'tpls/timelinePreview.tpl.html',
        controller: 'timelinePreviewController'
    }
})
.directive('timelineControls', () => {
    return {
        restrict: 'E',
        templateUrl: 'tpls/timelineControls.tpl.html',
        controller: 'timelineControlsController'
    }
})
.directive('previewFrame', () => {
    return {
        restrict: 'E',
        scope: {
            frame: '='
        },
        templateUrl: 'tpls/previewFrame.tpl.html',
        controller: 'previewFrameController'
    }
})
.filter('intervalSpeed', () => {
    return input => {
        if(!input) return '';
        return (input / 1000).toFixed('1') + 's';
    };
})

//environment variables
.constant('API_URL', 'http://localhost:8000')
// .constant('API_URL', 'http://theglitchery.com');

.run(function($window, $rootScope, filterService) {

    let img = document.getElementById('replaceMe');
    $rootScope.selectedFilter = filterService[0];

    $rootScope.onUpload = (filepath) => {
        img.src = '/' + filepath;

        img.onload = function() {
            $rootScope.$apply(function(){
                $rootScope.filterize.setBaseImage(img);
            });
        }
    }

    let pre = (imgData, drawFn) => {

    }

    let post = (imgData, drawFn) => {
        var data = $rootScope.selectedFilter.fn(imgData);

        if(data.data) {
            data = data.data;
        }

        drawFn(new ImageData(data,imgData.width, imgData.height));
    }

    //create the filterize object
    $rootScope.filterize = new Filterize(img, pre, post, 20);
    $rootScope.frames = [];

    //lol probably not "the angular way"
    document.getElementById('putCanvasHere').appendChild($rootScope.filterize.getCanvas());
});

