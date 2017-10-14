(function() {
  'use strict';

  angular
    .module('application')
    .controller('ReportController', ReportController);

  function ReportController($scope, ReportService, $stateParams) {
    $scope.report = {};
    $scope.month = '';
    $scope.year = '';

    ReportService.getReport($stateParams.month, $stateParams.year)
      .then(function (response) {
        $scope.users = response.users || [];
      });
  }
}());