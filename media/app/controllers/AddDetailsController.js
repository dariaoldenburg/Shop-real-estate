(function() {
    'use strict';

    angular
        .module('application')
        .controller('AddDetailsController', AddDetailsController);

    function AddDetailsController($scope, $state, PageService, AddPageService, $rootScope) {
        $scope.status = false;

        $scope.addPage = AddPageService.status.addPage;
        $scope.addPageStep = 1;
        $rootScope.$broadcast('addPageStep', {
            addPageStep: $scope.addPageStep
        });

        $scope.prooflyBranding = 1;

        $scope.addPage = function () {
            PageService.addPage({
                name: $scope.namePage,
                url: $scope.url,
                utm_source: $scope.utmSource,
                utm_medium: $scope.utmMedium,
                proofly_branding: $scope.prooflyBranding,
                verification: $scope.verification
            })
                .then(function(result) {
                    AddPageService.setStep($scope.addPageStep);
                    $rootScope.$broadcast('addPageStep', {
                        addPageStep: AddPageService.status.addPageStep
                    });
                    $state.go('nav.addPage.installation', {
                        pageId: result.data.page.id
                    });
                });
        };

    }
}());