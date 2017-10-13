(function() {
  'use strict';

  angular
    .module('application')
    .controller('RegisterController', RegisterController);

  function RegisterController($scope, AuthService, $rootScope) {
    $scope.login = '';
    $scope.phone = null;
    $scope.password = '';
    $scope.buttonEnabled = true;

    $rootScope.$watch('login', function (obje) {
      console.log(obje);
    });

    $scope.register = function () {
      console.log('click');
    }
  }
}());