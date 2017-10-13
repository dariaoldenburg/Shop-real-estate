(function() {
    'use strict';

    angular
        .module('application')
        .controller('RemindPasswordController', RemindPasswordController);

    function RemindPasswordController($scope, $state, AuthService) {
        $scope.email = '';

        $scope.remindPassword = function () {
            AuthService.remindPassword($scope.email).then(function(result) {
                $state.go('register');
            });
        };


    }
}());