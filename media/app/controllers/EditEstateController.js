(function() {
  'use strict';

  angular
    .module('application')
    .controller('editEstateController', EditEstateController);

  function EditEstateController($scope, EstatesService, $state, $stateParams, $rootScope) {
    $scope.city = '';
    $scope.street = '';
    $scope.price = '';
    $scope.rooms = '';
    $scope.surface = '';
    $scope.floor = '';
    $scope.balcony = false;
    $scope.description = '';
    $scope.id = '';

    $scope.buttonEnabled = false;

    EstatesService.fetchEstateById($stateParams.id)
      .then(function (response) {
        var estateData = response.data.offer;
        $scope.id = estateData.id;
        $scope.city = estateData.city;
        $scope.street = estateData.street;
        $scope.price = estateData.price;
        $scope.rooms = estateData.no_rooms;
        $scope.surface = estateData.apartment_area;
        $scope.floor = estateData.floors;
        $scope.balcony = estateData.balcony;
        $scope.description = estateData.description;
      });

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

    $scope.updateEstate = function () {
      if ( $scope.images !== '' ) {
        $scope.newImage = $scope.images;
      }
      EstatesService.updateEstate({
        id: $scope.id,
        city: $scope.city,
        street: $scope.street,
        price: $scope.price,
        rooms: $scope.rooms,
        surface: $scope.surface,
        floor: $scope.floor,
        balcony: $scope.balcony,
        description: $scope.description,
        userId: $rootScope.currentUser.id
      })
        .then(function (response) {
          if ( response.data.success ) {
            $state.go('nav.estates');
          }
        })
    }
  }
}());