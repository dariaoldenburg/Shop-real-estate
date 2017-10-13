(function() {
    'use strict';

    angular
        .module('application')
        .controller('AddPageController', AddPageController);

    function AddPageController($scope, $state, AddPageService, PageService, pagesList) {
        $scope.status = false;

        $scope.addPage = AddPageService.setStatus(true);
        $scope.addPageStep = AddPageService.status.addPageStep;
        $scope.pagesList = pagesList;

        $scope.$on('addPageStep', function(event, args) {
            $scope.addPageStep = args.addPageStep;
            console.log($scope.addPageStep);
        });

        $scope.$on('pagesListUpdated', function(event, args) {
            $scope.pagesList = args.pagesList;
        });

    }
}());