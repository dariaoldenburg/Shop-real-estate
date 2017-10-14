(function() {
  'use strict';

  angular
    .module('application')
    .controller('EstatesController', EstatesController);

  function EstatesController($scope, EstatesService, FilterService, AuthService) {
    $scope.estates = [];
    $scope.filteredEstates = [];
    $scope.filters = Object.assign({}, FilterService.filters);

    EstatesService.fetchAllEstates()
      .then(function (response) {
        $scope.estates = response.data.offers || [];
        $scope.filteredEstates = response.data.offers || [];
      });

    $scope.setSold = function (offerID) {
      EstatesService.setSold(offerID);
    };

    $scope.buy = function (offer) {
      EstatesService.buy($scope.userId, offer.user_id, offer.id);
    };

    $scope.remove = function (offerID) {
      EstatesService.remove(offerID)
      ;
    };

    $scope.updateFilter = function(name) {
      FilterService.updateFilter(name, $scope.filters[name]);
    };

    $scope.$on(FilterService.status.FILTERS_UPDATED, function(filters) {
      $scope.filteredEstates = FilterService.filterList($scope.estates);
    })
  }
}());