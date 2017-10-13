(function() {
    'use strict';

    angular
        .module('application')
        .controller('ProfileController', ProfileController);

    function ProfileController($scope, $window, $rootScope, AuthService) {
        var user = $rootScope.currentUser;
        $scope.userId = user.id;
        $scope.email = user.email;
        $scope.name = user.name;
        $scope.telephone = user.telephone;

        $scope.settingsAccount = function () {
            AuthService.settingsAccount({
                email: $scope.email,
                previousPassword: $scope.previousPassword,
                password: $scope.password,
                password_confirmation: $scope.passwordConfirmation,
                name: $scope.name,
                telephone: $scope.telephone
            })
                .then(function(result) {
                    var user = JSON.stringify(result.data.user);
                    $window.localStorage.setItem('user', user);
                    $rootScope.currentUser = result.data.user;
                });
        };

    }
}());