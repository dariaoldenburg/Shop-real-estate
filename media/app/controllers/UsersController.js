(function() {
  'use strict';

  angular
    .module('application')
    .controller('UsersController', UsersController);

  function UsersController($scope, UsersService) {
    $scope.users = [];

    UsersService.fetchAllUsers()
      .then(function (response) {
        $scope.users = response.users || [];
      });

    $scope.changePassword = function (id, password) {
      UsersService.updatePassword(id, password);
    };

    $scope.removeUser = function (id) {
      UsersService.removeUser(id)
        .then(function (response) {
          $scope.users = response.users || [];
        });
    }
  }
}());