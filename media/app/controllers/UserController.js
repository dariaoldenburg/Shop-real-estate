(function() {
    'use strict';

    angular
        .module('application')
        .controller('UserController', UserController);

    function UserController($scope, $auth, $rootScope, $state) {

        $scope.logout = function() {
            $auth.logout().then(function() {
                localStorage.removeItem('user');
                $rootScope.authenticated = false;
                $rootScope.currentUser = null;
                $state.go('nav.login');
            });
        }

    }
}());
