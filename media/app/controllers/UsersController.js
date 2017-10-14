(function() {
  'use strict';

  angular
    .module('application')
    .controller('UsersController', UsersController);

  function UsersController($scope, $rootScope, UsersService) {
    $scope.users = [];
    $scope.month = 1;
    $scope.year = 2017;

    UsersService.fetchAllUsers($rootScope.currentUser.id)
      .then(function (response) {
        $scope.users = response.data.offers || [];
      });

    $scope.changePassword = function (id, password) {
      UsersService.updatePassword(id, password);
    };

    $scope.removeUser = function (id) {
      UsersService.removeUser(id)
        .then(function (response) {
          UsersService.fetchAllUsers($rootScope.currentUser.id)
            .then(function (response) {
              $scope.users = response.data.offers || [];
          });

          // $scope.users = response.users || [];
        });
    }
  }
}());