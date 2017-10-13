(function() {
    'use strict';

    angular
        .module('application')
        .controller('MainController', ['$scope', 'pagesList', 'PageService', '$rootScope', MainController]);

    function MainController($scope, pagesList, PageService, $rootScope) {

        $scope.pagesList = pagesList;

        $scope.setStatus = function (pageId, status) {
            PageService.editPage({
                id: pageId,
                status: status
            })
                .then(function(result) {
                });
        };

        $scope.deletePage = function (pageId) {
            PageService.deletePage(pageId).then(function(result) {
                for (var i = 0; i < pagesList.length; i++) {
                    if(pagesList[i].id == pageId){
                        pagesList.splice(i, 1);
                        $scope.pagesList = pagesList;
                    }
                }
                $rootScope.$broadcast('pagesListUpdated', { pagesList: $scope.pagesList });
            });
        };

    }
}());