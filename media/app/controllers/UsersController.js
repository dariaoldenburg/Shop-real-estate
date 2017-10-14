(function() {
  'use strict';

  angular
    .module('application')
    .controller('UsersController', UsersController);

  function UsersController($scope, $rootScope, UsersService) {
    $scope.users = [];

    UsersService.fetchAllUsers($rootScope.currentUser.id)
      .then(function (response) {
        $scope.users = response.offers || [];
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