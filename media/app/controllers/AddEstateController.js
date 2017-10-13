(function() {
  'use strict';

  angular
    .module('application')
    .controller('addEstateController', AddEstateController);

  function AddEstateController($scope, EstatesService, AuthService) {
    $scope.city = '';
    $scope.street = '';
    $scope.price = '';
    $scope.rooms = '';
    $scope.surface = '';
    $scope.floor = '';
    $scope.balcony = false;
    $scope.description = '';

    $scope.buttonEnabled = true;

    $scope.addEstate = function () {
      EstatesService.addEstate({
        city: $scope.city,
        street: $scope.street,
        price: $scope.price,
        rooms: $scope.rooms,
        surface: $scope.surface,
        floor: $scope.floor,
        balcony: $scope.balcony,
        description: $scope.description,
        userID: AuthService.userID,
      })
        .then(function (response) {
          console.log(response);
        })
    }
  }
}());