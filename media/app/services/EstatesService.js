(function() {
  'use strict';

  angular
    .module('application')
    .service('EstatesService', EstatesService);

  function EstatesService($http) {
    var self = this;

    self.fetchAllEstates = function () {
      return $http({
        method: 'GET',
        url: 'api/offers'
      });
    };

  }
}());