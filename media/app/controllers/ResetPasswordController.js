(function() {
    'use strict';

    angular
        .module('application')
        .controller('ResetPasswordController', ResetPasswordController);

    function ResetPasswordController($scope, $stateParams, $state,AuthService) {
        $scope.tokenParam = $stateParams.token;
        $scope.email = '';
        $scope.password = '';
        $scope.passwordConfirmation = '';

        $scope.resetPassword = function () {
            AuthService.resetPassword({
                token: $scope.tokenParam,
                email: $scope.email,
                password: $scope.password,
                password_confirmation: $scope.passwordConfirmation
            })
                .then(function(result) {
                    $state.go('nav.login');
                });
        };


    }
}());