(function() {
  'use strict';

  angular
    .module('application')
    .controller('LoginController', LoginController);

  function LoginController($scope, AuthService, $state) {
    $scope.email = '';
    $scope.password = '';
    $scope.buttonEnabled = false;

    $scope.$watch('[email, password]', function () {
      $scope.buttonEnabled =
        $scope.email !== ''
        && $scope.password !== ''
    }, true);

    $scope.login = function () {
      AuthService.login($scope.email, $scope.password);
    }
  }
}());