(function() {
    'use strict';

    angular
        .module('application')
        .controller('PageSettingsController', PageSettingsController);

    function PageSettingsController($scope, $window, $timeout, pagesList, $stateParams, AddPageService) {
        $scope.pagesList = pagesList;
        $scope.pageId = $stateParams.pageId;
        $scope.addPage = AddPageService.setStatus(false);

        $timeout(function() {
            var currentState = $window.location.hash;
            var tabOfCurrentState = currentState.split("/");
            var index = tabOfCurrentState.indexOf('pageSettings');
            var active = tabOfCurrentState[index+1];
            $scope.active = active;
        }, 100);

        $scope.setActive = function (name) {
            $scope.active = name;
        };

    }
}());