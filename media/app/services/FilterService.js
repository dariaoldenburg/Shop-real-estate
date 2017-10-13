(function() {
  'use strict';

  angular
    .module('application')
    .service('FilterService', FilterService);

  function FilterService($rootScope) {
    var self = this;

    self.status = {
      FILTERS_UPDATED: 'FILTERS_UPDATED'
    };

    self.filters = {
      floor: null,
      priceFrom: null,
      priceTo: null,
      surfaceFrom: null,
      surfaceTo: null,
      roomsFrom: null,
      roomsTo: null
    };

    self.updateFilter = function (name, value) {
      self.filters[name] = value;
      $rootScope.$broadcast(self.status.FILTERS_UPDATED, self.filters);
    };

    self.filterList = function (list) {
      return list.filter(function (item) {
        var f = self.filters;
        if ( f.floor && item.floors !== f.floor ) {
          return false;
        }
        if ( f.priceFrom && item.price < f.priceFrom ) {
          return false;
        }
        if ( f.surfaceFrom && item.apartment_area < f.surfaceFrom ) {
          return false;
        }
        if ( f.roomsFrom && item.no_rooms < f.roomsFrom ) {
          return false;
        }
        if ( f.priceTo && item.price > f.priceTo ) {
          return false;
        }
        if ( f.surfaceTo && item.apartment_area > f.surfaceTo ) {
          return false;
        }
        if ( f.roomsTo && item.no_rooms > f.roomsTo ) {
          return false;
        }
        return true;
      })
    }
  }
}());