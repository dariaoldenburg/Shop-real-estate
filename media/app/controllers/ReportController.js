(function() {
  'use strict';

  angular
    .module('application')
    .controller('ReportController', ReportController);

  function ReportController($scope, ReportService, $stateParams) {
    $scope.offers = [];
    $scope.apartmentsSold = 0;
    $scope.avgPrice = 0;
    $scope.avgSurface = 0;
    $scope.month = $stateParams.month;
    $scope.year = $stateParams.year;

    ReportService.getReport($stateParams.month, $stateParams.year)
      .then(function (response) {
        $scope.offers = response.data.offers;
        $scope.apartmentsSold = response.data.offers.length;
        $scope.avgPrice = 0;
        response.data.offers.forEach(function(offer) {
          $scope.avgPrice += offer.price;
        });
        $scope.avgPrice /= response.data.offers.length;
        $scope.avgSurface = 0;
        response.data.offers.forEach(function(offer) {
          $scope.avgSurface += offer.apartment_area;
        });
        $scope.avgSurface /= response.data.offers.length;
      });
  }
}());