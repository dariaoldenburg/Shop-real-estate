(function() {
  'use strict';

  angular
    .module('application')
    .controller('addEstateController', AddEstateController);

  function AddEstateController($scope, EstatesService, AuthService, $state) {
    $scope.city = '';
    $scope.street = '';
    $scope.price = '';
    $scope.rooms = '';
    $scope.surface = '';
    $scope.floor = '';
    $scope.balcony = false;
    $scope.description = '';
    $scope.photoUploaded = false;

    $scope.buttonEnabled = false;

    $scope.$watch('[city ,street, price, rooms, surface, floor, balcony, description]', function () {
      $scope.buttonEnabled =
        $scope.city
        && $scope.street
        && $scope.price
        && $scope.rooms
        && $scope.surface
        && $scope.floor
        && $scope.description
    }, true);

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
          if ( response.data.success ) {
            $state.go('estates');
          }
        })
    }
  }
}());