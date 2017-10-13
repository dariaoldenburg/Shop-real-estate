(function() {
    'use strict';

    angular
        .module('application')
        .controller('InstallationController', InstallationController);

    function InstallationController($scope, $stateParams, page, AddPageService, $state, $rootScope) {
        $scope.pageId = $stateParams.pageId;
        $scope.pageApi = page.api_key;

        $scope.addPage = AddPageService.status.addPage;
        $scope.addPageStep = 2;
        $rootScope.$broadcast('addPageStep', {
            addPageStep: $scope.addPageStep
        });


        $scope.next = function () {
            AddPageService.setStep($scope.addPageStep);
            $rootScope.$broadcast('addPageStep', {
                addPageStep: AddPageService.status.addPageStep
            });
            AddPageService.status.addPage = true;
            $state.go('nav.addPage.notification', {
                pageId: $scope.pageId
            });
        };

    }
}());