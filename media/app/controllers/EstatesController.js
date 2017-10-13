(function() {
  'use strict';

  angular
    .module('application')
    .controller('EstatesController', EstatesController);

  function EstatesController($scope, EstatesService) {
    $scope.estates = [];
    $scope.userId = 2;

    EstatesService.fetchAllEstates()
      .then(function (response) {
        $scope.estates = response.data.offers || [];
      });

    $scope.setSold = function (offerID) {
      EstatesService.setSold(offerID);
    };

    $scope.buy = function (offer) {
      EstatesService.buy($scope.userId, offer.user_id, offer.id);
    }
  }
}());