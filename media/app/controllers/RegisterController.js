(function() {
  'use strict';

  angular
    .module('application')
    .controller('RegisterController', RegisterController);

  function RegisterController($scope, AuthService, $state) {
    $scope.email = '';
    $scope.phone = null;
    $scope.password = '';
    $scope.passwordAgain = '';
    $scope.buttonEnabled = true;

    $scope.register = function () {
      AuthService.register($scope.email, $scope.phone, $scope.password)
        .then(function (response) {
          if ( response.data.success ) {
            $state.go('login');
          }
        })
    }
  }
}());