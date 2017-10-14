(function() {
  'use strict';

  angular
    .module('application')
    .controller('ChangePasswordController', ChangePasswordController);

  function ChangePasswordController($scope, $stateParams, UsersService, $state) {
    $scope.idUser = $stateParams.id;
    $scope.buttonEnabled = false;
    $scope.password = '';
    $scope.password_confirmation = '';

    $scope.$watch('[password, password_confirmation]', function () {
      $scope.buttonEnabled =
        $scope.password !== ''
        && $scope.password_confirmation !== ''
    }, true);

    $scope.changePassword = function () {
      UsersService.updatePassword($scope.idUser, $scope.password, $scope.password_confirmation)
        .then(function (response) {
          console.log(response);
            $state.go('nav.estates');
        });
    }


  }
}());