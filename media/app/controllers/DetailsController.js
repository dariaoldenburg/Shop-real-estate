(function() {
    'use strict';

    angular
        .module('application')
        .controller('DetailsController', DetailsController);

    function DetailsController($scope, $state, page, PageService, $rootScope) {
        $scope.pageId = page.id;
        $scope.namePage = page.name;
        $scope.url = page.url;
        $scope.utmSource = page.utm_source;
        $scope.utmMedium = page.utm_medium;
        $scope.status = page.status;
        $scope.prooflyBranding = page.proofly_branding;
        $scope.verification = page.verification;

        $scope.editPage = function () {
            PageService.editPage({
                id: $scope.pageId,
                name: $scope.namePage,
                url: $scope.url,
                utm_source: $scope.utmSource,
                utm_medium: $scope.utmMedium,
                status: $scope.status,
                proofly_branding: $scope.prooflyBranding,
                verification: $scope.verification
            })
                .then(function(result) {
                    PageService.showPage(result.data.page.  user_id).then(function(response){
                        $rootScope.$broadcast('pagesListUpdated', { pagesList: response.data.pages });
                        $state.go('nav.main');
                    });
                });
        };
    }
}());