(function() {
  'use strict';

  angular
    .module('application')
    .controller('UsersController', ChangePasswordController);

  function ChangePasswordController($scope, $stateParams, UsersService) {

    $scope.idUser = $stateParams.id;

    $scope.changePassword = function () {
      UsersService.updatePassword($scope.idUser, $scope.password);
    };


  }
}());