(function() {
    'use strict';

    angular
        .module('application')
        .controller('WelcomeController', ['$scope', 'page', WelcomeController]);

    function WelcomeController($scope, page) {
        $scope.pageId = page.id;
    }
}());