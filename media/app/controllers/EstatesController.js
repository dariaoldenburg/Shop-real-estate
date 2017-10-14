(function() {
  'use strict';

  angular
    .module('application')
    .controller('EstatesController', EstatesController);

  function EstatesController($scope, EstatesService, FilterService, AuthService, $rootScope) {
    $scope.estates = [];
    $scope.filteredEstates = [];
    $scope.filters = Object.assign({}, FilterService.filters);

    if(!$rootScope.currentUser){
      EstatesService.fetchAllEstates()
        .then(function (response) {
          $scope.estates = response.data.offers || [];
          $scope.filteredEstates = response.data.offers || [];
        });
    } else {
      EstatesService.fetchEstateByUserId($rootScope.currentUser.id)
        .then(function (response) {
          $scope.estates = response.data.offers || [];
          $scope.filteredEstates = response.data.offers || [];
        });
    }

    $scope.setSold = function (offerID) {
      EstatesService.setSold(offerID);
    };

    $scope.buy = function (offer) {
      EstatesService.buy($scope.currentUser.id, offer.user_id, offer.id);
    };

    $scope.remove = function (offerID) {
      EstatesService.remove(offerID)
        .then(function () {
          EstatesService.fetchAllEstates()
            .then(function (response) {
              $scope.estates = response.data.offers || [];
              $scope.filteredEstates = response.data.offers || [];
            });
        });
    };

    $scope.updateFilter = function(name) {
      FilterService.updateFilter(name, $scope.filters[name]);
    };

    $scope.$on(FilterService.status.FILTERS_UPDATED, function(filters) {
      $scope.filteredEstates = FilterService.filterList($scope.estates);
    })
  }
}());