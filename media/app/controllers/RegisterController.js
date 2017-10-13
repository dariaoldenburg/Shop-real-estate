(function() {
    'use strict';

    angular
        .module('application')
        .controller('RegisterController', RegisterController);

    function RegisterController($scope, $state, $stateParams, RegisterService, $window) {
        $scope.email = '';
        $scope.url = '';
        $scope.name = '';
        $scope.telephone = '';
        $scope.confirmation_code = $stateParams.confirmation_code;
        $scope.emailparam = $stateParams.email;

        if(RegisterService.message && RegisterService.message.status ){
            $scope.message = RegisterService.message.content;
        }

        $scope.registerStepOne = function () {
            RegisterService.registerStepOne($scope.email).then(function(result) {
                $state.go('nav.register-second');
            });
        };

        $scope.registerStepSecond = function () {
            RegisterService.registerStepSecond({
                namePage: $scope.namePage,
                name: $scope.name,
                url: $scope.url,
                telephone: $scope.telephone
            })
                .then(function(result) {
                $state.go('nav.login');
                });
        };

        $scope.registerStepThird = function () {
            RegisterService.registerStepThird({
                password: $scope.password,
                password_confirmation: $scope.password_confirmation,
                email: $scope.emailparam
            })
                .then(function(result) {
                $window.localStorage.setItem('showWelcome', true);
                $state.go('nav.login');
                });
        };
    }
}());