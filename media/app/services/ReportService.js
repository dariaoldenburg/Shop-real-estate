(function () {
  'use strict';

  angular
    .module('application')
    .service('ReportService', ReportService);

  function ReportService($http) {
    var self = this;

    self.getReport = function (month, year) {
      return $http({
        method: 'GET',
        url: '/api/offers/generateReport/' + month + '/' + year
      });
    };

  }
}());