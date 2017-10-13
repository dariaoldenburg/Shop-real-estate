(function() {
    'use strict';

    angular
        .module('application')
        .controller('NavController', ['$scope', NavController]);

    function NavController($scope) {


        //zaimportuj pagesList
        // $scope.pagesList = pagesList;

        // $scope.$on('pagesListUpdated', function(event, args) {
        //     $scope.pagesList = args.pagesList;
        // });

    }
}());