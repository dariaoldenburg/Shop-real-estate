(function() {
    'use strict';

    angular
        .module('application')
        .controller('AppController', AppController);

    function AppController($window, $rootScope) {

        if ($window.localStorage.getItem('user')) {
            var user = $window.localStorage.getItem('user');
            $rootScope.authenticated = true;
            $rootScope.currentUser = JSON.parse(user);
        }
    }
}());